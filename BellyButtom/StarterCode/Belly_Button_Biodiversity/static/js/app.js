function buildMetadata(sample) {
    var url = `/metadata/${sample}`; 
    console.log(url);
  
    d3.json(url).then(function(response) {
      console.log(response);
  
      metaData = [response];
      console.log(metaData);

      samplePanel = d3.select("#sample-metadata")
      samplePanel.html("");

      metaData.forEach((selectSample) => {

      Object.entries(selectSample).forEach(([key, value]) => {
        var row = samplePanel.append("tr");
        row.text(key + ": " + value);
      })
    })
  })
}

function buildCharts(sample) {
  var graphUrl = `/samples/${sample}`; 
    console.log(graphUrl);

  d3.json(graphUrl).then(function(response) {
    console.log(response);

    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: "markers",
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }

    };

    var bubbleTrace = [trace1]
    var layout = {
      sort: true,
      xaxis: {
        title: {
          text:"OTU IDs"}
        },
      yaxis: {
        title: {
          text:"Sample Values"}
        },
      title: "Belly Button Biome",
      
      };

    Plotly.newPlot("bubble", bubbleTrace, layout);

    response.sample_values.sort(function compareFunction(firstNum, secondNum) {
        return secondNum - firstNum;
      });
  
    var trace2 = {
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      type: "pie",
      sort: true,
      text: response.otu_labels.slice(0,10)
     };

    var pieData = [trace2];

    var layout1 = {
      title: "Top 10 Samples"
    }

    Plotly.newPlot("pie", pieData, layout1);

  })

}

function init() {
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
