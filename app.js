/// select the user input field

var select_data_set = d3.select("#select-data-set");

/// select the demographic info 

var sample_metadata = d3.select("#sample-metadata");


/// create function to populate IDs and visualisations using the initial ID record

function init() 
{

// reset any previous data
resetData();

/// read in samples from JSON file
 d3.json("samples.json").then((data => 
    
{

//// POPULATE ID DATA TO DROPDOWN MENU 
///  use a forEach to loop over each name in the array data.names to populate dropdowns with IDs
        
        data.names.forEach((name => 
            
        {
        
        var option = select_data_set.append("option");
        option.text(name);

/// close loop   
        
        })); 

/// get the first ID from the list for initial charts as a default
    var firstID = select_data_set.property("value")

/// plot charts with first ID
    plotCharts(firstID);

/// close .then function
    })); 
/// close init() function
} 


/// Establish function to reset html divs to prep page for new data

function resetData() 
{
sample_metadata.html("");
barChart.html("");
bubbleChart.html("");
/// close resetData()
}; 

/// create function for plot charts
function plotCharts(id) {

    d3.json("samples.json").then((data => {

    /// filter the metadata for the ID chosen
    var single_metadata = data.metadata.filter(participant => participant.id == id)[0];

    /// get bb wfreq for gauge chart 
    var wfreq = single_metadata.wfreq;

    /// Iterate through each key/value pair in the metadata
     Object.entries(single_metadata).forEach(([key, value]) => 
        
    {
    var masterlist = sample_metadata.append("dl");
        masterlist.attr("class", "list-metadata");

    /// append a dt item to the description term tag

    var listItem = masterlist.append("dt");
        
    /// Establish the key value pair metadata to demographics list

        listItem.text(`${key}: ${value}`);

    /// close Iteration
    }); 
    
//// RETRIEVE DATA FOR PLOTTING CHARTS
/// filter the samples for the ID chosen

        var individualSample = data.samples.filter(sample => sample.id == id)[0];

    /// Establish empty variables to store sample data as array

        var sampleValues = [];
        var otuLabels = [];
        var otuIds = [];

    /// Iterate through each key/value pair in the sample for data visuals
    Object.entries(individualSample).forEach(([key, value]) => {

        switch (key) {
            case "sample_values":
            sampleValues.push(value);
            break;
            case "otu_labels":
            otuLabels.push(value);
            break;
            case "otu_ids":
            otuIds.push(value);
            break;
            // default break case
            default:
            break;
            /// close Switch   
            } 
        /// close Loop
        }); 

        /// slice and reverse the arrays to get the top 10 values, labels and IDs
        
        var top10SampleValues = sampleValues[0].slice(0, 10).reverse();
        var top10OtuLabels = otuLabels[0].slice(0, 10).reverse();
        var top10OtuIds = otuIds[0].slice(0, 10).reverse();
        
        

        /// use the map function to store the IDs with "OTU" for labelling y-axis
        
        var top10OtuIdsFormatted = top10OtuIds.map(otuID => "OTU " + otuID);


        /// PLOT BUBBLE CHART
        /// create trace
        var traceBub = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'Picnic'
            }
        };

        /// create the data array for  plot
        var dataBub = [traceBub];

        /// define plot layout
        var layoutBub = {
            font: {
                family: 'Lato'
            },
            hoverlabel: {
                font: {
                    family: 'Lato'
                }
            },
            xaxis: {
                title: "<b>OTU Id</b>",
                color: 'rgb(163,0,0)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(163,0,0)'
            },
            showlegend: false,
        };

        /// plot the bubble chat to the div id in html <div id="bubble">
        Plotly.newPlot('bubble', dataBub, layoutBub);

    
        //// PLOT BAR CHART
        // create a trace
        var traceBar = {
            x: top10SampleValues,
            y: top10OtuIdsFormatted,
            text: top10OtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(29,145,192)'
            }
        };

        // create the data array for plotting
        var dataBar = [traceBar];

        // define the plot layout
        var layoutBar = {
            height: 400,
            width: 600,
            font: {
                family: 'Lato'
            },
            hoverlabel: {
                font: {
                    family: 'Lato'
                }
            },
            title: {
                text: `<b>Top OTUs for Subject ${id}</b>`,
                font: {
                    size: 30,
                    color: 'rgb(19,2,124)'
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(19,2,124)'
                
            },
            yaxis: {
                tickfont: { size: 15 }
            }
        }


/// plot the bar chart to the "bar" div

Plotly.newPlot("bar", dataBar, layoutBar);
     

/// close .then function

    })); 

/// close plotCharts() function

    }; 

/// when dropdown select option changes this function is called with the next chosen id as the parameter
    /// reset the data and plot charts for the chosen ID 
function optionChanged(id) 
{
resetData();
plotCharts(id);
}

//// d3.Select the bubble & bar chart

var barChart = d3.select("#bar");
var bubbleChart = d3.select("bubble");

/// call the init() function for default data
init();
