console.log('hello...');
var csvdata;
d3.csv("/data/nmelghost/work_log_for_d3.csv")
		.get(function(error, rows) {
			csvdata = rows;
			console.log(csvdata);

			var csvdata_filtered = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL'; });
			console.log('csvdata_filtered');
			console.log(csvdata_filtered);

			var total = d3.nest()
							.rollup(function(d){
								return d.length;
							})
							.entries(csvdata_filtered);
			console.log('total rows = ' + total);

			var nested_data = d3.nest()
								.key(function(d) { return d.test_id; })
								.rollup(function(rows) { return {
																	"length": rows.length,
																	"total_time": d3.sum(rows, function(d) {
																													return +d.aggregate_report_90_percent_line;
																					})
																};
														}
								)
								.entries(csvdata_filtered);
			console.log(nested_data);
		});
