
// 1. Use the D3 library to read in `samples.json`.
// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//     * Use `sample_values` as the values for the bar chart.
//     * Use `otu_ids` as the labels for the bar chart.
//     * Use `otu_labels` as the hovertext for the chart.
var samples

// load JSON data
d3.json("samples.json").then( (data) => {
  samples = data; 

  // populate select dropdown
  var dropdown = d3.select("#selDataset")
  dropdown.append("option").text("Select Id").attr("disabled", true)
  samples.names.forEach((name) => {
    dropdown.append("option").text(name).attr("value", name);
  });
});

// populate dashboard when id is selected
function optionChanged(id) {
  get_everything(filter_samples(id));
}

//filter the data to match the selection in the drop down
function filter_samples(id) {
  var data = samples.samples.filter((s) => id == s.id)[0];
  var meta_data = samples.metadata.filter((m) => id == m.id)[0];
  return {data, meta_data}
}

function get_everything({data, meta_data}) {
  var data_as_objs = []

  for (var i = 0; i < data.otu_ids.length; i++) {
    var abc = {};
    abc.id = data.id;
    abc.otu_id = data.otu_ids[i].toString();
    abc.sample_value = data.sample_values[i];
    abc.otu_label = data.otu_labels[i];
    data_as_objs.push(abc)
  };

  var highest_levels = data_as_objs.sort(function compareFunction(a, b) {
    return b.sample_value - a.sample_value;
  })

  var sliced_highest_levels = highest_levels.slice(0, 10).reverse();
  var sorted_sliced_sample_values = []
  var sorted_sliced_otu_ids = []
  var sorted_sliced_otu_labels = []

  for (var i = 0; i < sliced_highest_levels.length; i++) {
    sorted_sliced_sample_values.push(sliced_highest_levels[i].sample_value)
    sorted_sliced_otu_ids.push(sliced_highest_levels[i].otu_id)
    sorted_sliced_otu_labels.push(sliced_highest_levels[i].otu_label.replace(/;/g, " "))
  }

  var trace1 = {
    x: sorted_sliced_sample_values,
    y: sorted_sliced_otu_ids,
    type: "bar",
    orientation: 'h',
    text: sorted_sliced_otu_labels,
  };

  var data = [trace1];

  var layout = {
    autosize: false,
      width: 700,
    title: "Belly Button Bar Bugs",
    xaxis: { title: "Number of Samples (sample values)" },
    yaxis: { title: "OTU ID", type: "category" }
  };

  Plotly.newPlot("bar", data, layout);


  // 3. Create a bubble chart that displays each sample.
  //     * Use `otu_ids` for the x values.
  //     * Use `sample_values` for the y values.
  //     * Use `sample_values` for the marker size.
  //     * Use `otu_ids` for the marker colors.
  //     * Use `otu_labels` for the text values.

  var trace2 = {
    x: sorted_sliced_otu_ids,
    y: sorted_sliced_sample_values,
    marker: {
      size: sorted_sliced_sample_values,
      color: sorted_sliced_otu_ids
    },
    mode: "markers",
    text: sorted_sliced_otu_labels,
  };

  var data2 = [trace2];

  var layout2 = {
    title: "Belly Button Bubble Bugs",
    xaxis: { title: "Number of Samples (sample values)"},
    yaxis: { title: "OTU ID", type: "category"}
  };

  Plotly.newPlot("bubble", data2, layout2);

  // 4. Display the sample metadata, i.e., an individual's demographic information.
  Object.entries(meta_data).forEach(([key, value]) => {
    d3.select("#sample-metadata").append("p").text(`${key}: ${value}`)
  })
};

// 5. Display each key-value pair from the metadata JSON object somewhere on the page.

// 6. Update all of the plots any time that a new sample is selected.


