
var samples;
// load JSON data
d3.json("samples.json").then((importedData) => {
    samples = importedData;

    // populate dropdown
    var dropDown = d3.select('#selDataset')
        .classed("custom-select", true);

    var options = dropDown
        .selectAll('option')
        .data(importedData.names)
        .enter()
        .append('option')
        .text(function (d) { return d; });

});

// populate dashboard 
function optionChanged(sampleID) {
    // filter data to match the selection in the dropdown
    var filter1 = samples.metadata.filter(function (d) {
        if ((parseInt(d.id) === parseInt(sampleID))) {
            return d;
        }
    });

    // create demographic information section
    filter1.forEach((d) => {
        console.log(d);
        // add element and remove the existing one
        var demographicInfo = d3.select('#sample-metadata');
        demographicInfo.selectAll("table").remove();
        // create variable
        var tableData = demographicInfo
            .append('table')
        // create ttable
        var tableSamples = tableData
            .append('tbody');
        // add rows and cells for the table
        Object.entries(d).forEach(([key, value]) => {
            var row = tableSamples.append("tr");
            var cell = row.append("td").text(key);
            var cell = row.append("td").text(value);
        });
    });

    // grab samples section corresponding to id selected via filter
    filter2 = samples.samples.filter(function (x) {
        if ((parseInt(x.id) === parseInt(sampleID))) {
            return x;
        }
    });

    filter2.forEach((x) => {

        // sort the data
        var bbsv = x.sample_values.slice(0);
        var bboid = x.otu_ids.slice(0);
        var bbol = x.otu_labels.slice(0);

        // combine the arrays for sorting
        var list = [];
        for (var j = 0; j < bboid.length; j++)
            list.push({ 'bbsv': bbsv[j], 'bboid': bboid[j], 'bbol': bbol[j] });
        
        // sort descending by sample value
        list.sort(function(a, b) {
            return ((a.bbsv > b.bbsv) ? -1 : ((a.bbsv == bbsv.name) ? 0 : 1));
        });

        // put sorted data back
        for (var k = 0; k < list.length; k++) {
            bbsv[k] = list[k].bbsv;
            bboid[k] = `id:${list[k].bboid.toString()}`;
            bbol[k] = list[k].bbol;
        }

        // clean up labels for hover text
        var bbol = bbol.slice(0, 10);

        for (var i = 0; i < bbol.length; i++) {
            bbol[i] = bbol[i].replace(/;/g, '<br>');
        }
        var trace1 = {
            type: 'bar',
            marker:{
                color: 'royalblue'
            },
            x: bbsv.slice(0, 10).reverse(),
            y: bboid.slice(0, 10).reverse(),
            hovertext: bbol,
            orientation: 'h' 
        };

        var data = [trace1];

        var layout1 = {
            title: "<b>Most Prominent OTUs</b>",
        }
        
        Plotly.newPlot('bar', data, layout1);

        // Create the Gauge Chart
        var bubble_color=x.otu_ids;
        bubble_color = bubble_color.map(function(val){return val;});

        var trace2 = {
            x: x.otu_ids,
            y: x.sample_values,
            mode: 'markers',
            text: x.otu_labels,
            marker: {
                size: x.sample_values,
                color: bubble_color,
                colorscale: "Rainbow"
            }
        };

        var data = [trace2];

        var layout2 = {
            title: "<b>Belly Button Biodiversity</b>",
            xaxis: {
                title: {
                  text: 'OTU ID'}}
        };

        Plotly.newPlot('bubble', data, layout2);

        // Create the Gauge Chart
        
        var wfreq;

        // Grab the wash frequwncy from the metadata
        filter1.forEach((d) => {
            wfreq = parseInt(d.wfreq);

        });

        var data = [
            {
                value: wfreq,
                title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" }, bgcolor: "white", borderwidth: 2, bordercolor: "white",
                    steps: [{ range: [0, 4.5], color: 'cyan' }, {
                        range: [4.5, 10], color: 'royalblue'
                    }], threshold: { line: { color: "red", width: 4 }, thickness: 0.75, value: wfreq }
                }
            }
        ];

        var layout3 = {};

        Plotly.newPlot('gauge', data, layout3);

    });

}

             