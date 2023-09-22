// Set URL in a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

// Initialize dashboard and use D3 to select dropdown menu
function init() {
    let dropdown = d3.select("#selDataset");

    // Use D3 to get sample names and populate drop-down menu
    d3.json(url).then((data) => {

        // Set variable for names
        let names = data.names;

        // Add names to dropdown menu 
        names.forEach((id) => {

            // log the value of id for each iteration of loop
            console.log(id);

            dropdown.append("option")
            .text(id)
            .property("value", id);
        });

        // Set the first sample from the list
        let sample = names[0];

        // Log value of sample
        console.log(sample);

        // Build initial plots
        buildMetadata(sample);
        buildBarChart(sample);
        buildBubbleChart(sample);
    });
};

// Function that populates metadata information
function buildMetadata(sample) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of objects after filter
        console.log(value);

        // Get the first index 
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual pairs and append to metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Function that builds bar chart
function buildBarChart(sample) {
    
    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleinfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleinfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {
    
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;
        
        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) {

    // Log the new value
    console.log(value);

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Call the initialize function
init();