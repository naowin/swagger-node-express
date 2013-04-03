var baseUrl = document.URL.substring(0, document.URL.lastIndexOf('/swagger/index.html'));

function domainMenu(){
    var leUrl = baseUrl + '/docs/domains.json';
    $('#input_baseUrl').val(baseUrl + '/docs/resources.json');

    $.ajax(leUrl, {
        type: 'GET',
        dataType: 'json',
        success: function(data)
        {
            createDomainMenu(data);
        },
        error  : function(e)
        {
            console.log('Error Getting Domains: ' + e);
        }
    });
}

function createDomainMenu(data) {
    var html = [];

    html.push( "<div id='resource_menu' class='container'>",
                    "<ul id='resources'>",
                    "<div class='domainHeading'><h3 class='domainHeader'>Domains</h3></div>"
    );

    var domains = data.domains.sort();

    for(var domain in domains)
    {
        html.push(
                        "<li id='resource_all' class='resource'>",
                            "<div class='heading'>",
                                "<h2>",
                                    "<a id='" + domains[domain] +"' class='domainLink'>" + capitaliseFirstLetter(domains[domain]) + "</a>",
                                "</h2>",
                            "</div>",
                        "</li>"
        )
    }

    html.push(      "<br><br><div class='domainHeading'><h3 class='domainHeader'>NoDomains</h3></div>");

    var otherDomains = data.otherDomains.sort();
    for(var domain in otherDomains)
    {
        // NoDomain has NO DOMAINS ... will be mapped in future version.
        html.push(
                    "<li id='resource_all' class='resource'>",
                        "<div class='heading'>",
                            "<h2>",
                                "<a id='no_domain' class='domainLink'>" + capitaliseFirstLetter(otherDomains[domain]) + "</a>",
                            "</h2>",
                        "</div>",
                    "</li>"
        )
    }

    html.push(

                    "</ul>",
                "</div>"
    );

    $('#swagger-ui-container').html(html.join(""));

    $('.domainLink').click(function(e){
        var id = $(this).attr('id');
        if(id != '')
        {
            id = '?domain=' + id.toLowerCase();
        }

        var e = jQuery.Event("keyup"); e.keyCode = 13;
        var input = $('#input_baseUrl');
        input.val(baseUrl + '/docs/resources.json' + id);
        input.trigger(e);

        $('#resource_menu').hide();
    });
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}