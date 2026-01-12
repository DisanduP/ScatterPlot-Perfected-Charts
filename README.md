# CSV to Draw.io Scatter Plot Converter

A powerful Node.js CLI tool that converts CSV data into interactive Draw.io scatter plot diagrams. Perfect for visualizing data relationships, mathematical functions, statistical distributions, and geometric patterns.

## Features

- **Flexible CSV Input**: Supports x,y,label columns or auto-detects first three columns
- **Auto-scaling**: Automatically scales axes to fit your data range
- **Smart Labeling**: Labels positioned below data points for clarity
- **Error Handling**: Gracefully skips invalid data rows
- **Customizable Output**: Adjustable canvas dimensions and output filenames
- **Draw.io Compatible**: Generates standard .drawio XML files

## Installation

1. Ensure you have Node.js installed (version 12+ recommended)
2. Clone or download the project files
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Basic Usage
```bash
node converter.js -i data.csv
```

### With Custom Options
```bash
node converter.js -i data.csv -o my_plot.drawio -w 1200 -h 800
```

### Command Line Options

- `-i, --input <path>`: Input CSV file path (required)
- `-o, --output <path>`: Output Draw.io file path (default: scatterplot.drawio)
- `-w, --width <number>`: Canvas width in pixels (default: 800)
- `-h, --height <number>`: Canvas height in pixels (default: 600)

## CSV Format

Your CSV file should contain at least two columns for x and y coordinates:

### Standard Format
```csv
x,y,label
1,2,Point A
3,4,Point B
5,6,Point C
```

### Flexible Column Names
The tool automatically detects columns:
- Looks for `x`, `y`, `label` columns first
- Falls back to using the first three columns in order
- Labels are optional

### Examples
- `x,y` - Coordinates only
- `value1,value2,name` - Custom column names
- `x,y,label` - Full format with labels

## Output

Generates a `.drawio` file containing:
- X and Y axes with arrows
- Data points as red circles
- Labels positioned below each point
- Auto-scaled to fit all data

## Viewing Diagrams

1. Open the generated `.drawio` file in:
   - Draw.io desktop application
   - Online Draw.io editor at https://app.diagrams.net
2. The diagram will display as an interactive scatter plot

## Examples Gallery

This repository includes 29 example diagrams showcasing various data patterns:

### Basic Patterns
- `sample_scatter.drawio` - Basic 5-point scatter
- `line_pattern_scatter.drawio` - Perfect diagonal line
- `random_spread_scatter.drawio` - Random distribution

### Mathematical Functions
- `sine_wave_scatter.drawio` - Trigonometric sine wave
- `quadratic_scatter.drawio` - Quadratic curve (y=x²)
- `exponential_scatter.drawio` - Exponential growth
- `parabola_scatter.drawio` - Parabolic curve

### Geometric Shapes
- `circle_scatter.drawio` - Circular pattern
- `triangle_scatter.drawio` - Triangle vertices
- `square_scatter.drawio` - Square corners
- `star_scatter.drawio` - Star shape
- `heart_scatter.drawio` - Heart approximation

### Statistical Distributions
- `normal_dist_scatter.drawio` - Normal distribution
- `outliers_scatter.drawio` - Data with outliers
- `clusters_scatter.drawio` - Clustered data

### Edge Cases & Testing
- `negative_scatter.drawio` - Negative coordinates
- `large_numbers_scatter.drawio` - Large numerical values
- `decimals_scatter.drawio` - High precision decimals
- `duplicates_scatter.drawio` - Overlapping points
- `close_points_scatter.drawio` - Very close points
- `fifty_points_scatter.drawio` - Large dataset (50 points)
- `mixed_data_scatter.drawio` - Mixed valid/invalid data

### Advanced Patterns
- `spiral_scatter.drawio` - Spiral pattern
- `grid_scatter.drawio` - Grid arrangement
- `centered_scatter.drawio` - Origin-centered points

## Data Requirements

- At least 2 columns (x,y coordinates)
- Numeric values for x and y (non-numeric rows are skipped)
- Optional third column for labels
- No header row required (but recommended)

## Error Handling

- Invalid numeric values are automatically skipped
- Empty files or no valid data trigger error messages
- Missing input file shows usage instructions

## Customization

The generated Draw.io XML can be further customized by:
- Editing colors, shapes, and sizes in Draw.io
- Adding titles, legends, or annotations
- Combining multiple diagrams
- Exporting to various formats (PNG, SVG, PDF)

## Dependencies

- `csv-parser`: For robust CSV parsing
- `commander`: For CLI argument handling

## License

ISC License - Feel free to use and modify as needed.

## Contributing

Contributions welcome! Please test with various CSV formats and data types.

---

**Happy visualizing!** 📊✨
