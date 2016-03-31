function Directive(id, args, srow) {
	this.id = id;
	this.args = args;
	this.children = undefined;
	this.up = undefined;
	this.srow = srow;
	Object.defineProperty(this, 'up', { enumerable: false });
}

Directive.tab = '  ';

Directive.prototype = {
	getPath: function () {
		if (!this.up)
			return [];
		var upp = this.up.getPath();
		upp.push(this.id);
		return upp;
	},
	toString: function (indent, is_ui) {
		if (!indent)
			indent = '';
		if (!this.up)
			return this.childrenToString(indent, is_ui);
		if (is_ui) {
			var s = this.args ? [indent, this.id, ' ', this.args].join('') : indent + this.id;
			if (this.children && this.children.length)
				s += '\n' + this.childrenToString(indent + Directive.tab, is_ui);
			else
				s += '\n';
		} else {
			var s = [indent, this.id, '(', this.args || '', ')'].join('');
			if (this.children)
				s += ' {\n' + this.childrenToString(indent + Directive.tab, is_ui) + indent + '}';
			s += '\n';
		}
		return s;
	},
	childrenToString: function (indent, is_ui) {
		var s = '';
		if (this.children) {
			this.children.forEach(function (d) {
				s += d.toString(indent, is_ui);
			});
		}
		return s;
	},
	add: function (d) {
		if (this.children === undefined)
			this.children = [];
		this.children.push(d);
		d.up = this;
	},
	enumChildren: function (cb) {
		if (!this.children)
			return;
		for (var i = 0, ch = this.children, n = ch.length; i < n; ++i) {
			var sub = ch[i];
			cb(sub, sub.id, sub.args)
		}
	}
};

function parse_tree(text) {
	if (typeof text !== 'string')
		throw TypeError('source is not a string type');
	var rows = text.split(/\r\n?|\n\r?/),
	    root = new Directive('root',''),
	    data = root,
	    last = undefined,
	    indents = [ 0 ];
	    indent = 0;

	rows.forEach(function (row, index) {
		var ind = /^([\t\s]*)(.*)$/.exec(row);
		var row = ind[2];
		if (!row || row[0] === '#') // comment
			return ;

		var els = /^([a-z0-9-_$]+)(?:\s*(.*))?$/.exec(row);
		if (!els)
			throw(Error(opts.file+'(' + (index+1) + '): Syntax error'));

		var dir = new Directive(els[1], els[2], index),
		    level = ind[1].length;
		if (level > indent) {
			data = last;
			indents.push(indent);
			indent = level;
		} else
			if (level < indent) {
				do {
					data = data.up;
					indent = indents.pop();
				} while (indent > level);
				if (indent !== level)
					throw(Error(opts.file+'(' + index-1 + '): Indentation error (not a regular indent)'));
			}
		data.add(last = dir);
	});
	return root;
}

module.exports = parse_tree;

parse_tree.Node = Directive;
