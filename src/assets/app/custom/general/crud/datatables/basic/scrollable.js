"use strict";var KTDatatablesBasicScrollable={init:function(){$("#kt_table_1").DataTable({scrollY:"50vh",scrollX:!0,scrollCollapse:!0,columnDefs:[{targets:-1,title:"Actions",orderable:!1,render:function(a,t,e,n){return'\n                        <span class="dropdown">\n                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">\n                              <i class="la la-ellipsis-h"></i>\n                            </a>\n                            <div class="dropdown-menu dropdown-menu-right">\n                                <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\n                                <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\n                                <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\n                            </div>\n                        </span>\n                        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">\n                          <i class="la la-edit"></i>\n                        </a>'}},{targets:8,render:function(a,t,e,n){var s={1:{title:"Pending",class:"kt-badge--brand"},2:{title:"Delivered",class:" kt-badge--danger"},3:{title:"Canceled",class:" kt-badge--primary"},4:{title:"Success",class:" kt-badge--success"},5:{title:"Info",class:" kt-badge--info"},6:{title:"Danger",class:" kt-badge--danger"},7:{title:"Warning",class:" kt-badge--warning"}};return void 0===s[a]?a:'<span class="kt-badge '+s[a].class+' kt-badge--inline kt-badge--pill">'+s[a].title+"</span>"}},{targets:9,render:function(a,t,e,n){var s={1:{title:"Online",state:"danger"},2:{title:"Retail",state:"primary"},3:{title:"Direct",state:"success"}};return void 0===s[a]?a:'<span class="kt-badge kt-badge--'+s[a].state+' kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-'+s[a].state+'">'+s[a].title+"</span>"}}]}),$("#kt_table_2").DataTable({scrollY:"50vh",scrollX:!0,scrollCollapse:!0,createdRow:function(a,t,e){var n={1:{title:"Pending",class:"kt-badge--brand"},2:{title:"Delivered",class:" kt-badge--danger"},3:{title:"Canceled",class:" kt-badge--primary"},4:{title:"Success",class:" kt-badge--success"},5:{title:"Info",class:" kt-badge--info"},6:{title:"Danger",class:" kt-badge--danger"},7:{title:"Warning",class:" kt-badge--warning"}},s='<span class="kt-badge '+n[t[18]].class+' kt-badge--inline kt-badge--pill">'+n[t[18]].title+"</span>";a.getElementsByTagName("td")[18].innerHTML=s,s='<span class="kt-badge kt-badge--'+(n={1:{title:"Online",state:"danger"},2:{title:"Retail",state:"primary"},3:{title:"Direct",state:"success"}})[t[19]].state+' kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-'+n[t[19]].state+'">'+n[t[19]].title+"</span>",a.getElementsByTagName("td")[19].innerHTML=s},columnDefs:[{targets:-1,title:"Actions",orderable:!1,render:function(a,t,e,n){return'\n                        <span class="dropdown">\n                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">\n                              <i class="la la-ellipsis-h"></i>\n                            </a>\n                            <div class="dropdown-menu dropdown-menu-right">\n                                <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\n                                <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\n                                <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\n                            </div>\n                        </span>\n                        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">\n                          <i class="la la-edit"></i>\n                        </a>'}}]})}};jQuery(document).ready(function(){KTDatatablesBasicScrollable.init()});