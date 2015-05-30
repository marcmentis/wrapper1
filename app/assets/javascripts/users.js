$(function(){
if($('body.users').length) {

	//DECLARE VARIABLES
		var ID = '';
		  	function set_id(x){ID = x};

	//STYLING
		$('#divUserPageWrapper').addClass('pad_3_sides');
		$('#divUserPageInnerWrapper').addClass('centered')
									.css({'width':'75em'});
		$('#divUserAsideRt').addClass('float_right form_container')
							.css({'width':'250px'})
							.hide();
		$('#UserAsideRtErrors').addClass('error_explanation')
								.hide();

		$('#fUserSearch').addClass('form_container').css({'width':'692px'});
		// Can't use .hide() as wont work with IE 10
		$('#b_user_select').addClass('move_off_page')

		//button
		$('[id^=b_]').button().addClass('reduce_button')

		//dates
		// $('[id^=dt]').datepicker().css({'width':'7em'});

	//SELECTS
		//TO DO show appropriate only if Admin2
		$('#slt_user_S_facility, #slt_user_Rt_facility').mjm_addOptions('facility', {firstLine: 'Facilities'})

		//Filter when facility changed
		$('#slt_user_S_facility').change(function(){
			user_complex_search1();
		});


	$('#divUserGrid').html('<p> This should work </p>')

	// RUN ON OPENING
	user_refreshgrid('nil');
	// user_complex_search1();

	//*****************************************************
	//FUNCTIONS CALLED FROM ABOVE

	function user_refreshgrid(url){

		if (url == 'nil') {url = '/users'};
		
		//Create Table and Div for grid and navigation "pager" 
	 	// $("#divUserGrid").remove();         
		$('#divUserGrid').html('<table id="divTable" style="background-color:#E0E0E0"></table><div id="divPager"></div>');
		//Define grid

		$("#divTable").jqGrid({
			url: url,
			datatype:"json",
			mtype:"GET",
			colNames:["id","FirstName","LastName","Authen","eMail", "Finit", "Minit", "Facility"],
			colModel:[
				{name:"id",index:"id",width:55, hidden:true},
				{name:"firstname",index:"firstname",width:125,align:"center"},
				{name:"lastname",index:"lastname",width:125,align:"center"},
				{name:"authen",index:"authen",width:100,align:"center"},
				{name:"email",index:"email",width:200,align:"center"},
				{name:"firstinitial",index:"firstinitial",width:25,align:"center"},
				{name:"middleinitial",index:"middleinitial",width:25,align:"center"},
				{name:"facility",index:"facility",width:75,align:"center"}
			],
			editurl:"/users",
			pager:"#divPager",
			height:390,
			width: 700,
			altRows: true,
			rowNum:15,
			rowList:[15,25,40],
			sortname:"lastname",
			sortorder:"asc",
			viewrecords:true,
			gridview: true, //increased speed can't use treeGrid, subGrid, afterInsertRow
			// loadonce: true,  //grid load data only once. datatype set to 'local'. Futher manip on client. 'Pager' functions disabled
			caption:"Users ",

		        loadComplete: function(){
		        	// alert('in loadComplete')
		        },

				onSelectRow:function(id) { 
					set_id(id);  //set the ID variable
					data_for_params = {user: {id: id}}

					$.ajax({ 
							  url: '/users/'+id+'',
							  data: data_for_params,
							  //type: 'POST',
							  type: 'GET',
							  dataType: 'json'
						}).done(function(data){
							user_clearFields();
							$('#b_user_Rt_Submit').attr('value','Edit');
							$('#divUserAsideRt, #b_user_Rt_Submit, #b_user_Rt_Back').show();
							$('#id').val(data.id);
							$('#ftx_user__Rt_firstname').val(data.firstname);
							$('#ftx_user__Rt_lastname').val(data.lastname);
							$('#ftx_user__Rt_authen').val(data.authen);
							$('#ftx_user__Rt_email').val(data.email);
							$('#ftx_user__Rt_firstinitial').val(data.firstinitial);
							$('#ftx_user__Rt_middleinitial').val(data.middleinitial);
							$('#slt_user__Rt_facility').val(data.facility);

													  
						}).fail(function(){
							alert('Error in: /user');
						});
				},

				loadError: function (jqXHR, textStatus, errorThrown) {
			        alert('HTTP status code: ' + jqXHR.status + '\n' +
			              'textStatus: ' + textStatus + '\n' +
			              'errorThrown: ' + errorThrown);
			        alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
			    },

			    //The JASON reader. This defines what the JSON data returned should look 
				    //This is the default. Not needed - only if return does NOT look like this
					// jsonReader: { 
					// 	root: "rows", 
					// 	page: "page", 
					// 	total: "total", 
					// 	records: "records", 
					// 	repeatitems: true, 
					// 	cell: "cell", 
					// 	id: "id",
					// 	userdata: "userdata",
					// 	subgrid: { 
					// 	 root:"rows", 
					// 	 repeatitems: true, 
					// 	 cell:"cell" 
					// 	} 
					// },	

		})
		.navGrid('#divPager', 
			{edit:false,add:false,del:false,search:false,refresh:false}
			// {edit:false,add:false,del:true,search:false,refresh:false}
			// {"del":true}, 
			// {"closeAfterEdit":true,"closeOnEscape":true}, 
			// {}, {}, {}, {}
	 	  )
		.navButtonAdd('#divPager', {
			caption: 'New',
			buttonicon: '',
			onClickButton: function(){		
				user_clearFields();
				// $('#divPatientAsideRt, #bNew, #bBack').show();
				// $('#bDelete, #bEdit').hide();

				$('#divUserAsideRt, #b_user_Rt_Submit, #b_user_Rt_Back').show();
				$('#b_user_Rt_Submit').attr('value','New');
			},
			position:'last'
		})
		.navButtonAdd('#divPager', {
			caption: 'Delete',
			buttonicon: '',
			onClickButton: function(){	
				if (ID.length > 0) {	
					if(confirm("Are you sure you want to delete this user")){
						user_ajax1('/users/'+ID+'', 'DELETE');	
					} else {
						return true;
					};
				};
			},
			position:'last'
		});
	};


	function user_clearFields(){
		$('#ftx_user_Rt_firstname, #ftx_user_Rt_lastname, #ftx_user_Rt_authen, #ftx_user_Rt_email, #ftx_user_firstinitial, #ftx_user_middleinitial, #slt_user_Rt_facility').val('');
		$('#UserAsideRtErrors').html('').hide();
	 };
	

};		//if($('#body.users').length) {
});		//$(function(){






	