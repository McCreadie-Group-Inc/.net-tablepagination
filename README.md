# .net-tablepagination
A JQuery plug-in designed for a .net application to easily create pagination in a gridview or standard html table.


The plug-in is desgined for .net but could easily be implemented in any web app.

How to use:

To initialize call:
	$(document).ready(function () {
		$('#/*tableID*/').tablepagination({/*options*/});
	});

Current options include:

	UseCookies:
	Set to true to hold values on post back and to use multiple tables on same page.
	
	EditMode:
	Dynamically set to true if dynamically adding rows. This will remove the paging button and dropdownlist.
	Intended for an EditTemplate inside an asp:GridView
	
	ddlValues:
	Pass an array to set the values of the RowsToShow select element.
  
Dependencies:
JQuery 3.5.1 or higher 
Bootstrap v4 (this can be optional but, by default styling is achieved with Bootstrap)
