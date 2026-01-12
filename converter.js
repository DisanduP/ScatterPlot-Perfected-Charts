#!/usr/bin/env node

const fs = require('fs');
const csv = require('csv-parser');
const { program } = require('commander');

// 1. CLI Configuration
program
  .version('1.0.5')
  .requiredOption('-i, --input <path>', 'Input CSV file path')
  .option('-o, --output <path>', 'Output Draw.io file path', 'scatterplot.drawio')
  .option('-t, --title <string>', 'Chart Title', 'Scatterplot Analysis')
  .option('-w, --width <number>', 'Canvas width in pixels', 800)
  .option('-h, --height <number>', 'Canvas height in pixels', 600)
  .parse(process.argv);

const options = program.opts();
const results = [];

// 2. Main Logic: Read CSV
fs.createReadStream(options.input)
  .pipe(csv())
  .on('data', (data) => {
    const keys = Object.keys(data);
    const x = parseFloat(data.x || data[keys[0]]);
    const y = parseFloat(data.y || data[keys[1]]);
    const label = data.label || data[keys[2]] || '';
    
    if (!isNaN(x) && !isNaN(y)) {
      results.push({ x, y, label });
    }
  })
  .on('end', () => {
    generateDrawio(results);
  });

function generateDrawio(data) {
  if (data.length === 0) {
    console.error("❌ Error: No valid data found in CSV.");
    return;
  }

  // 3. Calculate Bounds
  const xValues = data.map(p => p.x);
  const yValues = data.map(p => p.y);
  
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Layout Configuration
  const padding = 80; 
  const axisOffset = 60; 
  
  const graphW = options.width - (padding * 2);
  const graphH = options.height - (padding * 2);

  // Helper: Format numbers nicely
  const fmt = (n) => n % 1 === 0 ? n.toString() : n.toFixed(1).replace(/\.0$/, '');

  // 4. XML Construction
  let xmlBody = `
<mxfile host="Electron" modified="${new Date().toISOString()}" agent="CSV-CLI" type="device">
  <diagram id="scatterplot" name="Page-1">
    <mxGraphModel dx="${options.width}" dy="${options.height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
`;

  // --- Add Title ---
  xmlBody += `
        <mxCell id="chart-title" value="${options.title}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=24;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="0" y="20" width="${options.width}" height="40" as="geometry"/>
        </mxCell>`;

  const mapX = (val) => {
    if (maxX === minX) return padding + (graphW / 2);
    return padding + ((val - minX) / (maxX - minX)) * graphW;
  };

  const mapY = (val) => {
    if (maxY === minY) return padding + (graphH / 2);
    return padding + graphH - ((val - minY) / (maxY - minY)) * graphH;
  };

  // --- Add Axes & Ticks ---
  const axisYPos = padding + graphH + axisOffset;
  const axisXPos = padding - axisOffset;

  // Axes Lines
  xmlBody += `
        <mxCell id="axis-x" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="${axisXPos}" y="${axisYPos}" as="sourcePoint"/>
            <mxPoint x="${padding + graphW + axisOffset + 20}" y="${axisYPos}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="axis-y" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="${axisXPos}" y="${axisYPos}" as="sourcePoint"/>
            <mxPoint x="${axisXPos}" y="${padding - 20}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;

  // Ticks
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    // X Ticks
    const valX = minX + (maxX - minX) * (i / steps);
    const screenX = mapX(valX);
    xmlBody += `
        <mxCell id="xtick-${i}" value="" style="endArrow=none;html=1;strokeWidth=1;" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="${screenX}" y="${axisYPos}" as="sourcePoint"/>
            <mxPoint x="${screenX}" y="${axisYPos + 5}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="xlabel-${i}" value="${fmt(valX)}" style="text;html=1;align=center;verticalAlign=top;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="${screenX - 20}" y="${axisYPos + 8}" width="40" height="20" as="geometry"/>
        </mxCell>`;

    // Y Ticks
    const valY = minY + (maxY - minY) * (i / steps);
    const screenY = mapY(valY);
    xmlBody += `
        <mxCell id="ytick-${i}" value="" style="endArrow=none;html=1;strokeWidth=1;" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="${axisXPos}" y="${screenY}" as="sourcePoint"/>
            <mxPoint x="${axisXPos - 5}" y="${screenY}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="ylabel-${i}" value="${fmt(valY)}" style="text;html=1;align=right;verticalAlign=middle;whiteSpace=wrap;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="${axisXPos - 45}" y="${screenY - 10}" width="40" height="20" as="geometry"/>
        </mxCell>`;
  }

  // --- Add Data Points (With Smart Label Positioning) ---
  data.forEach((point, index) => {
    const screenX = mapX(point.x);
    const screenY = mapY(point.y);
    
    // Define 4 position variations
    const posBottom = "verticalLabelPosition=bottom;verticalAlign=top;align=center;";
    const posTop    = "verticalLabelPosition=top;verticalAlign=bottom;align=center;";
    const posRight  = "labelPosition=right;verticalLabelPosition=middle;align=left;";
    const posLeft   = "labelPosition=left;verticalLabelPosition=middle;align=right;";
    
    // Cycle through positions: Bottom -> Top -> Right -> Left
    // This ensures neighbors don't share the same text space
    let labelStyle = posBottom; 
    const remainder = index % 4;
    if (remainder === 1) labelStyle = posTop;
    if (remainder === 2) labelStyle = posRight;
    if (remainder === 3) labelStyle = posLeft;

    const baseStyle = "ellipse;whiteSpace=nowrap;html=1;aspect=fixed;fillColor=#f8cecc;strokeColor=#b85450;";
    
    xmlBody += `
        <mxCell id="pt-${index}" value="${point.label}" style="${baseStyle}${labelStyle}" vertex="1" parent="1">
          <mxGeometry x="${screenX - 6}" y="${screenY - 6}" width="12" height="12" as="geometry"/>
        </mxCell>`;
  });

  // XML Footer
  xmlBody += `
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

  fs.writeFileSync(options.output, xmlBody);
  console.log(`✅ Success! Generated ${options.output} with Smart Labels.`);
}