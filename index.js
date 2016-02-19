function Directive(id, args) {
	this.id = id;
	this.args = args;
	this.children = undefined;
	this.up = undefined;
	Object.defineProperty(this, 'up', { enumerable: false });
}

Directive.tab = '  ';

Directive.prototype = {
	toString: function (indent) {
		if (!indent)
			indent = '';
		if (!this.up)
			return this.childrenToString(indent);
		var s = [indent, this.id, '(', this.args || '', ')'].join('');
		if (this.children)
			s += ' {\n' + this.childrenToString(indent + Directive.tab) + indent + '}';
		return s;
	},
	childrenToString: function (indent) {
		var s = '';
		if (this.children)
			this.children.forEach(function (d) {
				s += d.toString(indent) + '\n';
			});
		return s;
	},
	add: function (d) {
		if (this.children === undefined)
			this.children = [];
		this.children.push(d);
		d.up = this;
	},
	enum: function (cb) {
		var path = [];
		function loop(d) {
			if (!d.children)
				return;
			var last = path.push('') - 1;
			for (var i = 0, ch = d.children, n = ch.length; i < n; ++i) {
				var sub = ch[i];
				path[last] = sub.id;
				cb(path, sub.args)
				loop(sub);
			}
			path.pop();
		}
		loop(this);
	}
};

function parse_tree(text) {
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

		var dir = new Directive(els[1], els[2]),
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
