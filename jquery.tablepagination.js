(function ($) {
    const skip5TextContent = ">>|";
    const back5TextContent = "|<<";
    const nextTextContent = ">>";
    const backTextConent = "<<";
    var settings;
    //used for offline version of plugin
    var ddlCookieHold;
    var pageCookieHold;
    $.extend({
        tablePagination: new
            function () {
                function setCookie(cname, cvalue) {
                    if (settings.useCookeies === true) {
                        var d = new Date();
                        d.setTime(d.getTime() + 20 * 60 * 1000); //first value: set for minutes to hold cookie
                        var expires = "expires=" + d.toUTCString();
                        var host = window.location.hostname;
                        document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 EST';
                        if ((host.match(/\./g) || []).length > 1) {
                            host = "." + host; // code for domain cookie. does not work for test or localhost
                            document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=" + host + ";path=/";
                        } else {
                            document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
                        }
                    } else {
                        if (cname.includes('_ddlCookie')) {
                            ddlCookieHold = cvalue;
                        } else if (cname.includes('_pageCookie')) {
                            pageCookieHold = cvalue;
                        }
                    }
                }
                function getCookie(cname) {
                    if (settings.useCookeies === true) {
                        var name = cname + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) === ' ') {
                                c = c.substring(1);
                            }
                            if (c.indexOf(name) === 0) {
                                return c.substring(name.length, c.length);
                            }
                        }
                    } else {
                        if (cname.includes('_ddlCookie')) {
                            return ddlCookieHold;
                        } else if (cname.includes('_pageCookie')) {
                            return pageCookieHold;
                        }
                    }
                    return "";
                }
                function ddlChange(table) {
                    setCookie('rowsToShow_' + table[0].id + '_ddlCookie', parseInt(document.getElementById('ddlRowsToShow' + table[0].id).value));
                    setCookie('pagination_' + table[0].id + '_pageCookie', 1);
                    let ddlCookie = getCookie('rowsToShow_' + table[0].id + '_ddlCookie');
                    if (ddlCookie > 0) {
                        for (let r = 0; r < table[0].tBodies[0].rows.length; r++) {
                            if (r >= ddlCookie) {
                                table[0].tBodies[0].rows[r].style.display = 'none';
                            } else {
                                table[0].tBodies[0].rows[r].style.display = '';
                            }
                        }
                    } else {
                        for (let r = 0; r < table[0].tBodies[0].rows.length; r++) {
                            table[0].tBodies[0].rows[r].style.display = '';
                        }
                    }
                }
                function paginationOnClick(me, table) {
                    let tableID = table[0].id;
                    setCookie('rowsToShow_' + tableID + '_ddlCookie', parseInt(document.getElementById('ddlRowsToShow' + tableID).value));
                    let ddlCookie = getCookie('rowsToShow_' + tableID + '_ddlCookie');
                    let ulPagination = $('#' + tableID + '_ulPagination');
                    let pageValuesEnd = ulPagination[0].childElementCount - 4;
                    let activePage;
                    if (me.textContent === back5TextContent) {
                        activePage = 1;
                    } else if (me.textContent === skip5TextContent) {
                        activePage = me.parentElement.childNodes[me.parentElement.childElementCount - 1].value;
                    } else {
                        activePage = me.value;
                    }
                    if (me.id === me.parentElement.firstChild.id) {
                        //first button
                        activePage = firstButtonClick(me, pageValuesEnd);
                    }
                    else if (me.id === me.parentElement.lastChild.id) {
                        //last button
                        activePage = lastButtonClick(me, pageValuesEnd);
                    }
                    else if (me.value === me.parentElement.childNodes[3].value && !(me.value === 1)) {
                        //first index
                        activePage = firstIndexClick(me, pageValuesEnd);
                    }
                    else if (me.value === me.parentElement.childNodes[pageValuesEnd].value && me.value < table[0].tBodies[0].rows.length / ddlCookie) {
                        //last index
                        activePage = lastIndexClick(me, pageValuesEnd);
                    }
                    else if (me.textContent === back5TextContent) {
                        //back 5
                        activePage = back5Click(me, pageValuesEnd, tableID);
                    }
                    else if (me.textContent === skip5TextContent) {
                        //skip 5
                        activePage = skip5Click(me, pageValuesEnd, tableID);
                    }
                    else if (me.textContent === backTextConent) {
                        //back button
                        activePage = backClick(me, pageValuesEnd, tableID);
                    }
                    else if (me.textContent === nextTextContent) {
                        //next button
                        activePage = nextClick(me, pageValuesEnd, tableID);
                    }
                    paginationOnClickLoop(activePage, table, ddlCookie);
                    activeIndexCheck(table, activePage);
                    setCookie('pagination_' + tableID + '_pageCookie', activePage);
                }
                //********Click Functions********************//
                function firstButtonClick(me, pageValuesEnd) {
                    for (let l = 3; l <= pageValuesEnd; l++) {
                        me.parentElement.childNodes[l].value = l - 2;
                        me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                    }
                    return 1;
                }
                function lastButtonClick(me, pageValuesEnd) {
                    for (let l = 3; l <= pageValuesEnd; l++) {
                        me.parentElement.childNodes[l].value = me.parentElement.childNodes[pageValuesEnd + 3].value - (pageValuesEnd - 2) + l - 2;
                        me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                    }
                    return me.parentElement.childNodes[pageValuesEnd].value;
                }
                function firstIndexClick(me, pageValuesEnd) {
                    for (let l = 3; l <= pageValuesEnd; l++) {
                        me.parentElement.childNodes[l].value -= 1;
                        me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                    }
                    return me.parentElement.childNodes[3 + 1].value;
                }
                function lastIndexClick(me, pageValuesEnd) {
                    for (let l = 3; l <= pageValuesEnd; l++) {
                        me.parentElement.childNodes[l].value += 1;
                        me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                    }
                    return me.parentElement.childNodes[pageValuesEnd - 1].value;
                }
                function back5Click(me, pageValuesEnd, tableID) {
                    let back5Page = parseInt(getCookie('pagination_' + tableID + '_pageCookie')) - 5;
                    if (back5Page <= 1) {
                        for (let l = 3; l <= pageValuesEnd; l++) {
                            me.parentElement.childNodes[l].value = l - 2;
                            me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                        }
                        return 1;
                    } else {
                        let valueToDecrement = me.parentElement.childNodes[3].value === 4 ? 3 : 4
                        for (let l = 3; l <= pageValuesEnd; l++) {
                            me.parentElement.childNodes[l].value -= valueToDecrement;
                            me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                        }
                        return back5Page;
                    }
                }
                function skip5Click(me, pageValuesEnd, tableID) {
                    let skip5Page = parseInt(getCookie('pagination_' + tableID + '_pageCookie')) + 5;
                    if (skip5Page >= me.parentElement.childNodes[pageValuesEnd + 3].value) {
                        for (let l = 3; l <= pageValuesEnd; l++) {
                            if (!me.parentElement.childNodes[l].value + me.parentElement.childNodes[pageValuesEnd + 3].value - 5 > me.parentElement.childNodes[pageValuesEnd + 3].value) {
                                me.parentElement.childNodes[l].value += me.parentElement.childNodes[pageValuesEnd + 3].value - 6;
                                me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                            } else {
                                me.parentElement.childNodes[l].value = me.parentElement.childNodes[pageValuesEnd + 3].value - (pageValuesEnd - 2) + l - 2;
                                me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                            }
                        }
                        return me.parentElement.childNodes[pageValuesEnd + 3].value;
                    } else {
                        let valueToIncrement = me.parentElement.childNodes[3].value + 4 >= me.parentElement.childNodes[pageValuesEnd].value - 4 ? 3 : 4
                        for (let l = 3; l <= pageValuesEnd; l++) {
                            me.parentElement.childNodes[l].value += valueToIncrement;
                            me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                        }
                        return skip5Page;
                    }
                }
                function backClick(me, pageValuesEnd, tableID) {
                    let backPage = parseInt(getCookie('pagination_' + tableID + '_pageCookie')) - 1;
                    if (backPage <= 1) {
                        return 1;
                    } else if (backPage < me.parentElement.childNodes[pageValuesEnd].value && backPage > me.parentElement.childNodes[3].value) {
                        return backPage;
                    } else {
                        for (let l = 3; l <= pageValuesEnd; l++) {
                            me.parentElement.childNodes[l].value -= 1;
                            me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                        }
                        return backPage;
                    }
                }
                function nextClick(me, pageValuesEnd, tableID) {
                    let nextPage = parseInt(getCookie('pagination_' + tableID + '_pageCookie')) + 1;
                    if (nextPage >= me.parentElement.childNodes[pageValuesEnd + 3].value) {
                        return me.parentElement.childNodes[pageValuesEnd + 3].value;
                    } else if (nextPage < me.parentElement.childNodes[pageValuesEnd].value) {
                        return nextPage;
                    } else {
                        for (let l = 3; l <= pageValuesEnd; l++) {
                            me.parentElement.childNodes[l].value += 1;
                            me.parentElement.childNodes[l].firstChild.textContent = me.parentElement.childNodes[l].value;
                        }
                        return nextPage;
                    }
                }
                //*******************************************//
                function paginationOnClickLoop(myValue, table, ddlCookie) {
                    for (let r = 0; r < table[0].tBodies[0].rows.length; r++) {
                        if (r < myValue * ddlCookie && (myValue - 1) * ddlCookie <= r) {
                            table[0].tBodies[0].rows[r].style.display = '';
                        } else {
                            table[0].tBodies[0].rows[r].style.display = 'none';
                        }
                    }
                }
                function activeIndexCheck(table, activePage) {
                    let paginationList = $('#' + table[0].id + '_ulPagination')[0];
                    for (let i = 0; i < paginationList.childElementCount; i++) {
                        if (activePage === paginationList.childNodes[i].value) {
                            paginationList.childNodes[i].classList.add("active");
                        } else {
                            paginationList.childNodes[i].classList.remove("active");
                        }
                    }
                    //removes active from default list items
                    for (let i = 0; i < paginationList.childElementCount; i++) {
                        if (i <= 2 || i >= paginationList.childElementCount - 3) {
                            paginationList.childNodes[i].classList.remove("active");
                        }
                    }
                }
                function addPagination(table, startValue) {
                    let tableRows = table[0].tBodies[0].rows.length;
                    if (tableRows > 5) {
                        let tableID = table[0].id;
                        let ddlCookie = parseInt(getCookie('rowsToShow_' + tableID + '_ddlCookie'));
                        let lastValue = Math.floor((tableRows - 1 + ddlCookie) / ddlCookie);
                        $('<ul id="' + tableID + '_ulPagination" class="pagination"></ul >').appendTo('#div_' + tableID);
                        let ulPagination = $('#' + tableID + '_ulPagination');
                        ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="1" id="first_' + tableID + '"><a style="cursor:pointer;" class="page-link" >First</a></li>');
                        ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="back5" id="-5_' + tableID + '"><a style="cursor:pointer;" class="page-link" >' + back5TextContent + '</a></li>');
                        ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="back" id="<<_' + tableID + '"><a style="cursor:pointer;" class="page-link" >' + backTextConent + '</a></li>');
                        if (!(tableRows <= ddlCookie) && ddlCookie > 0) {
                            let row = 1;
                            if (startValue >= 5) {
                                if (Math.round(startValue * ddlCookie) / ddlCookie > Math.round(tableRows / ddlCookie) || startValue === lastValue) {
                                    startValue -= 4;
                                } else {
                                    startValue -= 3;
                                }
                            } else {
                                startValue = 1;
                            }
                            for (; row <= tableRows / ddlCookie && row <= 5; row++) {
                                if (startValue === 1) {
                                    ulPagination.append('<li class="page-item active paginationLink_' + tableID + '" value="' + startValue + '"><a style="cursor:pointer;" class="page-link">' + startValue + '</a></li>');
                                } else {
                                    ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="' + startValue + '"><a style="cursor:pointer;" class="page-link">' + startValue + '</a></li>');
                                }
                                startValue++;
                            }
                            if (!(tableRows % ddlCookie === 0) && row <= 5) {
                                ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="' + lastValue + '"><a style="cursor:pointer;" class="page-link" >' + lastValue + '</a></li>');
                            }
                        } else {
                            ulPagination.append('<li class="page-item active paginationLink_' + tableID + '" value="1"><a style="cursor:pointer;" class="page-link" >1</a></li>');
                        }
                        ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="next" id=">>_' + tableID + '"><a style="cursor:pointer;" class="page-link" >' + nextTextContent + '</a></li>');
                        ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="skip5" id="+5_' + tableID + '"><a style="cursor:pointer;" class="page-link" >' + skip5TextContent + '</a></li>');
                        ulPagination.append('<li class="page-item paginationLink_' + tableID + '" value="' + lastValue + '" id="last' + tableID + '"><a style="cursor:pointer;" class="page-link" >Last</a></li>');
                    }
                }
                function rebindEvents(table) {
                    $(".paginationLink_" + table[0].id).on("click",
                        function () { paginationOnClick(this, table); }
                    );
                    $("#ddlRowsToShow" + table[0].id).change(
                        function () {
                            ddlChange(table);
                            $('#' + table[0].id + '_ulPagination').remove();
                            if (parseInt(document.getElementById('ddlRowsToShow' + table[0].id).value) > 0) { addPagination(table, 1); }
                            rebindEvents(table);
                        }
                    );
                }
                this.construct = function (options) {
                    return this.each(function () {
                        settings = options !== undefined ? options : {};
                        var $this = $(this);
                        let tableID = $this[0].id;
                        let ddlCookieName = 'rowsToShow_' + tableID + '_ddlCookie';
                        let pageCookieName = 'pagination_' + tableID + '_pageCookie';
                        let tableRows = $this[0].tBodies[0].rows.length;
                        let ddlCookie = getCookie(ddlCookieName);
                        let pageCookie = getCookie(pageCookieName);
                        let ddlCookieValue = parseInt(ddlCookie);
                        let pageCookieValue = parseInt(pageCookie);
                        if (pageCookie === '' || pageCookie === undefined) {
                            setCookie(pageCookieName, 1);
                            pageCookie = getCookie(pageCookieName);
                            pageCookieValue = parseInt(pageCookie);
                        }
                        if (ddlCookie === '' || ddlCookie === undefined) {
                            setCookie(ddlCookieName, 5);
                            ddlCookie = getCookie(ddlCookieName);
                            ddlCookieValue = parseInt(ddlCookie);
                        }

                        if (tableRows > 5) {
                            if (settings.EditMode !== true) {
                                $('<div class="form-row" id="div_' + tableID + '">').insertAfter('#' + tableID);
                                addPagination($this, pageCookieValue);
                                $('<select style="cursor:pointer;" class="form-control col-1 paginationDDL_' + tableID + '" id="ddlRowsToShow' + tableID + '">' +
                                    '<option value="5">5 Rows</option ><option value="10">10 Rows</option><option value="15">15 Rows</option><option value="25">25 Rows</option><option value="0">Show All</option>' +
                                    '</select>').insertBefore('#' + tableID + '_ulPagination');
                                document.getElementById('ddlRowsToShow' + tableID).value = ddlCookie;
                                $('</div>').insertAfter('#' + tableID);

                            }
                            if (ddlCookieValue > 0) {
                                for (let r = 0; r < tableRows; r++) {
                                    if (r < (pageCookieValue * ddlCookieValue) + (settings.EditMode !== undefined && settings.EditMode === true ? 1 : 0) && (pageCookieValue - 1) * ddlCookieValue <= r) {
                                        $this[0].tBodies[0].rows[r].style.display = '';
                                    } else {
                                        $this[0].tBodies[0].rows[r].style.display = 'none';
                                    }
                                }
                            } else {
                                for (let r = 0; r < tableRows; r++) {
                                    $this[0].tBodies[0].rows[r].style.display = '';
                                }
                            }
                            $(".paginationLink_" + tableID).on("click",
                                function () { paginationOnClick(this, $this); }
                            );
                            $("#ddlRowsToShow" + tableID).change(
                                function () {
                                    ddlChange($this);
                                    $('#' + tableID + '_ulPagination').remove();
                                    if (parseInt(document.getElementById('ddlRowsToShow' + tableID).value) > 0) { addPagination($this, 1); }
                                    rebindEvents($this);
                                }
                            );
                            //tablesorter.js ended event
                            $('#' + tableID).bind("sortEnd",
                                function () {
                                    ddlCookie = getCookie(ddlCookieName);
                                    ddlCookieValue = parseInt(ddlCookie);
                                    pageCookie = getCookie(pageCookieName);
                                    pageCookieValue = parseInt(pageCookie);
                                    if (ddlCookieValue > 0) {
                                        for (let r = 0; r < tableRows; r++) {
                                            if (r < pageCookieValue * ddlCookieValue && (pageCookieValue - 1) * ddlCookieValue <= r) {
                                                $this[0].tBodies[0].rows[r].style.display = '';
                                            } else {
                                                $this[0].tBodies[0].rows[r].style.display = 'none';
                                            }
                                        }
                                    }
                                }
                            );
                            if (settings.EditMode !== true) { activeIndexCheck($this, pageCookieValue); }
                        }
                    });
                };
            }
    });
    // extend plugin scope
    $.fn.extend({
        tablePagination: $.tablePagination.construct
    });
})(jQuery);