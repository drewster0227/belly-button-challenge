// Define the URL of the JSON file
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to fetch data and create charts
function init() {
  // Use d3.json() to fetch the data
  d3.json(url).then(function(data) {
    // Extract the necessary data from the JSON
    var samples = data.samples;
    var metadata = data.metadata;

    // Populate the dropdown menu with sample IDs
    var dropdown = d3.select("#selDataset");
    samples.forEach(sample => {
      dropdown.append("option").text(sample.id).property("value", sample.id);
    });

    // Initialize the page with the first sample
    var initialSample = samples[0].id;
    updateCharts(initialSample, samples, metadata);
    updateMetadata(initialSample, metadata);
  }).catch(function(error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching the data: ", error);
  });
}

// Function to update charts based on the selected sample
function optionChanged(selectedSample) {
  // Use d3.json() to fetch the data
  d3.json(url).then(function(data) {
    // Extract the necessary data from the JSON
    var samples = data.samples;
    var metadata = data.metadata;

    // Update the charts with the selected sample
    updateCharts(selectedSample, samples, metadata);
    updateMetadata(selectedSample, metadata);
  }).catch(function(error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching the data: ", error);
  });
}

// Function to update the bar chart
function updateCharts(sampleID, samples, metadata) {
  // Filter the data for the selected sample
  var selectedSample = samples.find(sample => sample.id === sampleID);
  var otuIds = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  var sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
  var otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart
  var trace = {
    x: sampleValues,
    y: otuIds,
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  // Create the data array for the plot
  var data = [trace];

  // Define the layout for the plot
  var layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  // Use Plotly to create the bar chart
  Plotly.newPlot('bar', data, layout);

  // Create the trace for the bubble chart
  var bubbleTrace = {
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    mode: 'markers',
    marker: {
      size: selectedSample.sample_values,
      color: selectedSample.otu_ids,
      colorscale: 'Earth',
      opacity: 0.8
    }
  };

  // Create the data array for the bubble chart
  var bubbleData = [bubbleTrace];

  // Define the layout for the bubble chart
  var bubbleLayout = {
    title: 'OTU ID Bubble Chart',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
  };

  // Use Plotly to create the bubble chart
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Function to update the sample metadata
function updateMetadata(sampleID, metadata) {
  // Filter the metadata for the selected sample
  var selectedMetadata = metadata.find(item => item.id === parseInt(sampleID));

  // Select the div where the metadata will be displayed
  var metadataDiv = d3.select("#sample-metadata");

  // Clear any existing metadata
  metadataDiv.html("");

  // Loop through the key-value pairs in the metadata and display them
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataDiv.append("p").text(`${key}: ${value}`);
  });
}

// Initialize the page
init();