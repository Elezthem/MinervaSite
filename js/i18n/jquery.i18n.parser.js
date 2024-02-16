(function($){'use strict';var MessageParser=function(options){this.options=$.extend({},$.i18n.parser.defaults,options);this.language=$.i18n.languages[String.locale]||$.i18n.languages['default'];this.emitter=$.i18n.parser.emitter;};MessageParser.prototype={constructor:MessageParser,simpleParse:function(message,parameters){return message.replace(/\$(\d+)/g,function(str,match){var index=parseInt(match,10)-1;return parameters[index]!==undefined?parameters[index]:'$'+match;});},parse:function(message,replacements){if(message.indexOf('{{')<0){return this.simpleParse(message,replacements);}
this.emitter.language=$.i18n.languages[$.i18n().locale]||$.i18n.languages['default'];return this.emitter.emit(this.ast(message),replacements);},ast:function(message){var pipe,colon,backslash,anyCharacter,dollar,digits,regularLiteral,regularLiteralWithoutBar,regularLiteralWithoutSpace,escapedOrLiteralWithoutBar,escapedOrRegularLiteral,templateContents,templateName,openTemplate,closeTemplate,expression,paramExpression,result,pos=0;function choice(parserSyntax){return function(){var i,result;for(i=0;i<parserSyntax.length;i++){result=parserSyntax[i]();if(result!==null){return result;}}
return null;};}
function sequence(parserSyntax){var i,res,originalPos=pos,result=[];for(i=0;i<parserSyntax.length;i++){res=parserSyntax[i]();if(res===null){pos=originalPos;return null;}
result.push(res);}
return result;}
function nOrMore(n,p){return function(){var originalPos=pos,result=[],parsed=p();while(parsed!==null){result.push(parsed);parsed=p();}
if(result.length<n){pos=originalPos;return null;}
return result;};}
function makeStringParser(s){var len=s.length;return function(){var result=null;if(message.slice(pos,pos+len)===s){result=s;pos+=len;}
return result;};}
function makeRegexParser(regex){return function(){var matches=message.slice(pos).match(regex);if(matches===null){return null;}
pos+=matches[0].length;return matches[0];};}
pipe=makeStringParser('|');colon=makeStringParser(':');backslash=makeStringParser('\\');anyCharacter=makeRegexParser(/^./);dollar=makeStringParser('$');digits=makeRegexParser(/^\d+/);regularLiteral=makeRegexParser(/^[^{}[\]$\\]/);regularLiteralWithoutBar=makeRegexParser(/^[^{}[\]$\\|]/);regularLiteralWithoutSpace=makeRegexParser(/^[^{}[\]$\s]/);function transform(p,fn){return function(){var result=p();return result===null?null:fn(result);};}
function literalWithoutBar(){var result=nOrMore(1,escapedOrLiteralWithoutBar)();return result===null?null:result.join('');}
function literal(){var result=nOrMore(1,escapedOrRegularLiteral)();return result===null?null:result.join('');}
function escapedLiteral(){var result=sequence([backslash,anyCharacter]);return result===null?null:result[1];}
choice([escapedLiteral,regularLiteralWithoutSpace]);escapedOrLiteralWithoutBar=choice([escapedLiteral,regularLiteralWithoutBar]);escapedOrRegularLiteral=choice([escapedLiteral,regularLiteral]);function replacement(){var result=sequence([dollar,digits]);if(result===null){return null;}
return['REPLACE',parseInt(result[1],10)-1];}
templateName=transform(makeRegexParser(/^[ !"$&'()*,./0-9;=?@A-Z^_`a-z~\x80-\xFF+-]+/),function(result){return result.toString();});function templateParam(){var expr,result=sequence([pipe,nOrMore(0,paramExpression)]);if(result===null){return null;}
expr=result[1];return expr.length>1?['CONCAT'].concat(expr):expr[0];}
function templateWithReplacement(){var result=sequence([templateName,colon,replacement]);return result===null?null:[result[0],result[2]];}
function templateWithOutReplacement(){var result=sequence([templateName,colon,paramExpression]);return result===null?null:[result[0],result[2]];}
templateContents=choice([function(){var res=sequence([choice([templateWithReplacement,templateWithOutReplacement]),nOrMore(0,templateParam)]);return res===null?null:res[0].concat(res[1]);},function(){var res=sequence([templateName,nOrMore(0,templateParam)]);if(res===null){return null;}
return[res[0]].concat(res[1]);}]);openTemplate=makeStringParser('{{');closeTemplate=makeStringParser('}}');function template(){var result=sequence([openTemplate,templateContents,closeTemplate]);return result===null?null:result[1];}
expression=choice([template,replacement,literal]);paramExpression=choice([template,replacement,literalWithoutBar]);function start(){var result=nOrMore(0,expression)();if(result===null){return null;}
return['CONCAT'].concat(result);}
result=start();if(result===null||pos!==message.length){throw new Error('Parse error at position '+pos.toString()+' in input: '+message);}
return result;}};$.extend($.i18n.parser,new MessageParser());}(jQuery));