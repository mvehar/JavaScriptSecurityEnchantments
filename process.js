var falafel = require('falafel')
var fs = require('fs')

var m = fs.readFileSync('test.js','utf8')


var out = falafel(m, (node)=>{
	if(node.type === 'CallExpression'){
		node.callee.update("_"+node.callee.source())
		console.log(node.parent)
		console.log('---')
		
		//node.update("test("+node.source()+")")
	}
	
})

console.log(out)