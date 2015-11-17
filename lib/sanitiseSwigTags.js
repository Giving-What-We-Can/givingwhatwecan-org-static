module.exports = function(html) {
	html = html.replace(/(?:<p(?:.*)?>)*(\{%|\{\{)(.*?)(\}\}|%\})(?:<\/p>)*/g,function(match,open,content,close){
        var a = open+content.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/(&nbsp;|&#xA0;)/g,' ')+close
        return a;
    })
    return html;
}