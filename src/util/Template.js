// http://ejohn.org/blog/javascript-micro-templating/

/**
*
<div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">
  <div class="grid_1 alpha right">
    <img class="righted" src="<%=profile_image_url%>"/>
  </div>
  <div class="grid_6 omega contents">
    <p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p>
  </div>
</div>

var results = document.getElementById("results");
results.innerHTML = Template("item_Template", dataObject);


<% for ( var i = 0; i < users.length; i++ ) { %>
  <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
<% } %>

var show_user = Template("item_Template"), html = "";
for ( var i = 0; i < users.length; i++ ) {
  html += show_user( users[i] );
}
*
*/

class Template {
  constructor () {
    this.cache = {};
  }

  apply (str, data) {
    // Hack
    // Input: '<div id="{id}" class="{cls}" style="{style}"></div>'
    // Output: '<div id="<%=id%>" class="<%=cls%>" style="<%=style%>"></div>'
    str = str.replace(/[{]/g, '<%=').replace(/[}]/g, '%>');

    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
        this.cache[str] = this.cache[str] ||
        this.apply(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'") +
        "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  }
}
