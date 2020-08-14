/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.46773120425814, "KoPercent": 0.5322687957418496};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5139930755914599, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.30835734870317005, 500, 1500, "Open_site"], "isController": true}, {"data": [0.569364161849711, 500, 1500, "flightst_click-3"], "isController": false}, {"data": [0.5635838150289018, 500, 1500, "Choose_flight-1"], "isController": false}, {"data": [0.5303468208092486, 500, 1500, "Insert_payment_details"], "isController": true}, {"data": [0.6127167630057804, 500, 1500, "logout-1"], "isController": false}, {"data": [0.6040462427745664, 500, 1500, "logout-2"], "isController": false}, {"data": [0.6372832369942196, 500, 1500, "login-3"], "isController": false}, {"data": [0.6242774566473989, 500, 1500, "login-2"], "isController": false}, {"data": [0.5722543352601156, 500, 1500, "Continue_click"], "isController": true}, {"data": [0.6011560693641619, 500, 1500, "login-1"], "isController": false}, {"data": [0.12283236994219653, 500, 1500, "Login"], "isController": true}, {"data": [0.5635838150289018, 500, 1500, "Choose_flight"], "isController": true}, {"data": [0.6340057636887608, 500, 1500, "open_site-2"], "isController": false}, {"data": [0.5632022471910112, 500, 1500, "open_site-1"], "isController": false}, {"data": [0.2976878612716763, 500, 1500, "Logout"], "isController": true}, {"data": [0.5303468208092486, 500, 1500, "Insert_payment_details-1"], "isController": false}, {"data": [0.630057803468208, 500, 1500, "flightst_click-2"], "isController": false}, {"data": [0.6242774566473989, 500, 1500, "flightst_click-1"], "isController": false}, {"data": [0.11705202312138728, 500, 1500, "Flightst_click"], "isController": true}, {"data": [0.5722543352601156, 500, 1500, "Continue_click-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4509, 24, 0.5322687957418496, 731.5107562652471, 216, 2509, 691.0, 1163.0, 1323.5, 1714.9999999999927, 7.50719251977943, 15.279020300658148, 5.362606483007672], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Open_site", 347, 0, 0.0, 1458.1037463976943, 446, 3658, 1417.0, 2240.2, 2684.7999999999997, 3472.759999999996, 0.5778498656124376, 2.2684763903783836, 0.5933154417054398], "isController": true}, {"data": ["flightst_click-3", 346, 0, 0.0, 761.4479768786125, 224, 1824, 710.5, 1220.3, 1447.65, 1696.53, 0.584909009458283, 2.5332729071752786, 0.39740841514593145], "isController": false}, {"data": ["Choose_flight-1", 346, 0, 0.0, 805.6531791907523, 230, 2509, 742.0, 1310.9000000000005, 1590.6999999999996, 1983.7899999999988, 0.5819331617807828, 1.7241369682081167, 0.5229800396715273], "isController": false}, {"data": ["Insert_payment_details", 346, 24, 6.936416184971098, 813.7514450867048, 231, 2043, 788.0, 1339.5000000000002, 1557.7999999999993, 1918.53, 0.580932648750659, 1.6053203031343497, 0.6412945259270576], "isController": true}, {"data": ["logout-1", 346, 0, 0.0, 715.5086705202307, 221, 1663, 666.0, 1186.9, 1334.85, 1636.53, 0.5804122604541306, 0.5758777896693327, 0.37734889518274595], "isController": false}, {"data": ["logout-2", 346, 0, 0.0, 724.9190751445086, 223, 1806, 703.5, 1185.0, 1296.0, 1570.2999999999997, 0.5796926623642078, 1.7014041159435587, 0.30060234737831476], "isController": false}, {"data": ["login-3", 346, 0, 0.0, 664.3092485549134, 223, 1322, 663.0, 1040.1000000000001, 1107.65, 1304.4199999999996, 0.58712333323152, 0.991343987458299, 0.38859237976274114], "isController": false}, {"data": ["login-2", 346, 0, 0.0, 693.4768786127165, 222, 1672, 676.5, 1092.2, 1267.0, 1560.4299999999992, 0.5877087342690245, 0.6557730307298629, 0.3861101606729435], "isController": false}, {"data": ["Continue_click", 346, 0, 0.0, 780.1878612716762, 232, 1747, 745.0, 1209.3, 1387.0499999999988, 1714.019999999999, 0.584166389497161, 1.491904214650758, 0.5894803805143365], "isController": true}, {"data": ["login-1", 346, 0, 0.0, 744.8497109826594, 230, 1985, 679.5, 1218.6, 1329.7499999999995, 1748.06, 0.5882302938601338, 0.4772149085990428, 0.43140717840718795], "isController": false}, {"data": ["Login", 346, 0, 0.0, 2102.641618497109, 676, 4359, 2085.0, 3206.2, 3639.899999999997, 4152.349999999989, 0.5866604270413155, 2.1211070163569743, 1.2039632906987194], "isController": true}, {"data": ["Choose_flight", 346, 0, 0.0, 805.6531791907523, 230, 2509, 742.0, 1310.9000000000005, 1590.6999999999996, 1983.7899999999988, 0.5819321830361723, 1.7241340684081463, 0.522979160079284], "isController": true}, {"data": ["open_site-2", 347, 0, 0.0, 683.8559077809798, 224, 2096, 655.0, 1083.4, 1262.1999999999998, 1705.8799999999983, 0.5782176897953742, 1.6962200007915083, 0.3015314905768846], "isController": false}, {"data": ["open_site-1", 356, 0, 0.0, 780.205056179775, 217, 2096, 703.0, 1295.5000000000002, 1528.15, 1848.0800000000004, 0.592716907749274, 0.5880863069074829, 0.29952573282119926], "isController": false}, {"data": ["Logout", 346, 0, 0.0, 1440.4277456647405, 447, 3093, 1373.0, 2295.0, 2496.8499999999995, 2962.9199999999955, 0.5794742192589764, 2.2757100600325244, 0.6772281102985632], "isController": true}, {"data": ["Insert_payment_details-1", 346, 24, 6.936416184971098, 813.7514450867047, 231, 2043, 788.0, 1339.5000000000002, 1557.7999999999993, 1918.53, 0.580932648750659, 1.6053203031343497, 0.6412945259270576], "isController": false}, {"data": ["flightst_click-2", 346, 0, 0.0, 686.9017341040459, 224, 1650, 648.0, 1118.6000000000001, 1243.65, 1386.5399999999995, 0.585758616661616, 0.9890396955155607, 0.39741363922432693], "isController": false}, {"data": ["flightst_click-1", 346, 0, 0.0, 653.3034682080926, 216, 1910, 629.5, 1019.9000000000001, 1105.25, 1340.669999999999, 0.5863343427547885, 0.4208552167234078, 0.39608646980547596], "isController": false}, {"data": ["Flightst_click", 346, 0, 0.0, 2101.656069364162, 666, 4419, 2064.5, 3129.6, 3403.399999999999, 3895.95, 0.5844673576669955, 3.937734668500588, 1.188471178136698], "isController": true}, {"data": ["Continue_click-1", 346, 0, 0.0, 780.1878612716763, 232, 1747, 745.0, 1209.3, 1387.0499999999988, 1714.019999999999, 0.5841654032260788, 1.4919016958102171, 0.5894793852714343], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/&lt;b&gt; $ &lt;\\\/b&gt;\\\/", 24, 100.0, 0.5322687957418496], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4509, 24, "Test failed: text expected to contain \\\/&lt;b&gt; $ &lt;\\\/b&gt;\\\/", 24, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Insert_payment_details-1", 346, 24, "Test failed: text expected to contain \\\/&lt;b&gt; $ &lt;\\\/b&gt;\\\/", 24, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
