exports.sanitise = function(html) {
	html = html.replace(/^(<p.*?>.*?|.*?)(\{%|\{\{)(.*?)(\}\}|%\})(.*?<\/p>|.*?)/gim,function(match,a1,a2,a3,a4,a5){
		a3 = a3.replace(/<.*?>.*?<\/.*>/g,' ').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/(&nbsp;|&#xA0;)/g,' ')
        var a = (a1 === '<p>' ? '' : a1) + a2+a3+a4 + (a5 === '</p>' ? '' : a5)
        return a;
    })
    return html;
}