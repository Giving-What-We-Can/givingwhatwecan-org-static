module.exports = function(html) {
	html = html.replace(/^(<p.*?>.*?|.*?)(\{%|\{\{)(.*?)(\}\}|%\})(.*?<\/p>|.*?)/gim,function(match,a1,a2,a3,a4,a5){
		console.log(a3)
		a3 = a3.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/(&nbsp;|&#xA0;)/g,' ')
		console.log(a3)
        var a = (a1 === '<p>' ? '' : a1) + a2+a3+a4 + (a5 === '</p>' ? '' : a5)
        return a;
    })
    return html;
}