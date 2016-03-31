var assert = require('core-assert'),
    json = require('nano-json'),
    timer = require('nano-timer');


function uni_test(fn, sradix, dradix, args, ret) {
	test(fn.name+'('+json.js2str(args, sradix)+') -> '+json.js2str(ret, dradix)+'', function (done) {
		assert.deepStrictEqual(args instanceof Array ? fn.apply(null, args) : fn.call(null, args), ret);
		done();
	});
}

function massive(name, fn, pairs, sradix, dradix) {
	suite(name, function () {
		for (var i = 0, n = pairs.length; i < n; i += 2)
			uni_test(fn, sradix, dradix, pairs[i], pairs[i+1]);
	});
}

function fail_test(fn, sradix, dradix, args, ret) {
	test(fn.name+'('+json.js2str(args, sradix)+') -> '+json.js2str(ret.name, dradix)+'', function (done) {
		assert.throws(function () {
			if (args instanceof Array)
				fn.apply(null, args);
			else
				fn.call(null, args);
		}, ret);
		done();
	});
}

function massive_fails(name, fn, pairs, sradix, dradix) {
	suite(name, function () {
		for (var i = 0, n = pairs.length; i < n; i += 2)
			fail_test(fn, sradix, dradix, pairs[i], pairs[i+1]);
	});
}

var parse_tree = require('../index.js');

var ui_text = "\
menu\n\
# comment test\n\
\n\
	h1 some options\n\
		text\n\
		text\n\
		# comment 2\n\
\n\
		h2\n\
			text\n\
\n\
		h2\n\
			text\n\
\n\
	h1\n\
		notice\n\
",
    to_str = "\
menu() {\n\
  h1(some options) {\n\
    text()\n\
    text()\n\
    h2() {\n\
      text()\n\
    }\n\
    h2() {\n\
      text()\n\
    }\n\
  }\n\
  h1() {\n\
    notice()\n\
  }\n\
}\n\
",
    to_ui_str = "\
menu\n\
  h1 some options\n\
    text\n\
    text\n\
    h2\n\
      text\n\
    h2\n\
      text\n\
  h1\n\
    notice\n\
",
    enum_str = "\
menu\n\
 menu.h1 some options\n\
  menu.h1.text\n\
  menu.h1.text\n\
  menu.h1.h2\n\
   menu.h1.h2.text\n\
  menu.h1.h2\n\
   menu.h1.h2.text\n\
 menu.h1\n\
  menu.h1.notice\n\
";


suite('parsing', function () {

	massive_fails('type checks', parse_tree, [
		null, TypeError,
		true, TypeError,
		1, TypeError,
		undefined, TypeError,
		function (){}, TypeError,
		{}, TypeError,
		[], TypeError
	]);

	test('basic ui toString', function (done) {
		var tree = parse_tree(ui_text);
		assert.strictEqual(tree.toString(), to_str);
		done();
	});

	test('basic ui toString (ui)', function (done) {
		var tree = parse_tree(ui_text);
		assert.strictEqual(tree.toString('', 1), to_ui_str);
		done();
	});

	test('syntax check', function (done) {
		try {
			var tree = parse_tree("@#$@#$");
		} catch (e) {
			return done();
		}
		done(Error('passed error'));
	});

	test('back indentation check', function (done) {
		try {
			var tree = parse_tree("\
ooo\n\
  bbb\n\
    ccc\n\
   wrong indent\n\
");
		} catch (e) {
			return done();
		}
		done(Error('passed error'));
	});

	test('basic ui childrenToString', function (done) {
		var tree = parse_tree("menu");
		assert.strictEqual(tree.children[0].childrenToString(), '');
		done();
	});

	test('basic ui childrenToString 2', function (done) {
		var tree = parse_tree(ui_text);
		assert.strictEqual(tree.childrenToString(), to_str);
		done();
	});

	test('enum ui', function (done) {
		var tree = parse_tree(ui_text),
		    s = '';
		function cb(node, id, args) {
			var path = node.getPath();
			s += ('        '.slice(0, path.length-1))+path.join('.')+(args ? ' '+args :'')+'\n';
			node.enumChildren(cb);
		}
		tree.enumChildren(cb);
		assert.strictEqual(s, enum_str);
		done();
	});


});
