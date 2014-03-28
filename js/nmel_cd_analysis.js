console.log('hello...analysing NMEL CD performance results...');
var csvdata;
d3.csv("/data/nmel_cd/agg_report_cd_environment_for_d3analysis.csv")
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
																	"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
																	"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
																	"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
																};
														}
								)
								.entries(csvdata_filtered);
			console.log(nested_data);

			// console.log('student opening exercise');
			// var csvdata_stu_open_exercise = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC05_04_Click_Open_Ex1'; });
			// var nested_data2 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_stu_open_exercise);
			// console.log(nested_data2);

			// console.log('click on course tab');
			// var csvdata_ss_click_course_tab = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC10_02_Click_Course_TAB'; });
			// var nested_data3 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_ss_click_course_tab);
			// console.log(nested_data3);

			// console.log('click on unit9');
			// var csvdata_ss_click_unit9 = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC10_03_Click_Unit9'; });
			// var nested_data4 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_ss_click_unit9);
			// console.log(nested_data4);

			// console.log('SS Opens Practice Exercise');
			// var csvdata_ss_opens_practice_ex = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC10_04_Open_Grammar_Practice_Ex1'; });
			// var nested_data5 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_ss_opens_practice_ex);
			// console.log(nested_data5);

			// console.log('SS Submits Practice Exercise');
			// var csvdata_ss_submits_practice_ex = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC10_05_Submit'; });
			// var nested_data6 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_ss_submits_practice_ex);
			// console.log(nested_data6);

			// console.log('SS Click Back to Course');
			// var csvdata_ss_click_baskto_course = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC10_06_BackToCourse'; });
			// var nested_data7 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_ss_click_baskto_course);
			// console.log(nested_data7);

			// console.log('SS View Report');
			// var csvdata_ss_view_report = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC10_07_View_Report'; });
			// var nested_data8 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_ss_view_report);
			// console.log(nested_data8);

			// console.log('Teacher Opens GradeBook');
			// var csvdata_tchr_opens_gradebook = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC08_02_Click_GradeBook'; });
			// var nested_data9 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_tchr_opens_gradebook);
			// console.log(nested_data9);

			// console.log('Teacher Opens Common Error Report');
			// var csvdata_tchr_opens_commonerror_report = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC08_07_Click_CommonErrorReport'; });
			// var nested_data10 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_tchr_opens_commonerror_report);
			// console.log(nested_data10);

			// console.log('Teacher Accepts Common Error');
			// var csvdata_tchr_accepts_commonerror = _.filter(csvdata, function(data) { return data.sampler_label !== 'SC05_01_nMEL_HomePage' && data.sampler_label !== 'SC05_02_nMEL_Login' && data.sampler_label !== 'TOTAL' && data.sampler_label === 'SC08_08_Click_Accept'; });
			// var nested_data11 = d3.nest()
			// 					.key(function(d) { return d.test_id; })
			// 					.rollup(function(rows) { return {
			// 														"length": rows.length,
			// 														"total_time": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }),
			// 														"total_time_sec": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000,
			// 														"total_time_min": d3.sum(rows, function(d) { return +d.aggregate_report_90_percent_line; }) / 1000 / 60
			// 													};
			// 											}
			// 					)
			// 					.entries(csvdata_tchr_accepts_commonerror);
			// console.log(nested_data11open);
		});
