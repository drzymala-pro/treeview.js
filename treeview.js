
const SYMBOL = {
	/* Not using HTML entities because of createTextNode() */
	EXPAND: "⊞",
	FOLD:   "⊟",
	EMPTY:  "⊡",
	LEAF:   "╴",
	BAR:    "│",
	SPACE:  " ",
	ELBOW:  "╰",
	TEE:    "├"
}


function Treeview(body_element) {

	var tv = this; /* Treeview pointer */
	this.filter = "";
	this.tree_model = null;
	this.body_element = body_element;
	this.body_element.classList.add("tv-container");
	this.filter_box = document.createElement("input");
	this.filter_box.classList.add("tv-filter");
	this.filter_box.placeholder = "Add filter...";
	this.filter_box.oninput = function(e){ tv.onfilter(this.value); };
	this.body_element.appendChild(this.filter_box);
	this.tree_box = document.createElement("div");
	this.body_element.appendChild(this.tree_box);

	this.onchange = function(new_data) {
		/* This function will be provided by user */
	}

	this.setData = function(data) {
		this.tree_model = data;
		this.redraw();
	}

	this.redraw = function() {
		var tv = this;
		var div = this.tree_box;
		var node = this.tree_model;
		var filter = this.filter;
		rebuild_tree(tv, div, node, filter);
		/* Run client callback */
		this.onchange(node);
	}

	this.onfilter = function(value) {
		this.filter = value;
		this.redraw();
	}
}


function node_is_leaf(node) { return node && node.name && ( ! node.list ); }
function get_node_name(node) { return node && node.name ? node.name : "<undefined>"; }
function node_is_marked(node) { return node && node.mark; }
function node_is_folder(node) { return node && node.list ? true : false; }
function node_is_folded(node) { return node && node.fold; }
function node_is_parent(node) { return node && node.list && (node.list.length > 0); }


function get_subnode(node, idx) {
	if ( node.list ) {
		if ( -1 < idx < node.list.length ) {
			return node.list[idx];
		}
	}
	return null;
}


function mousemove(tv, node, event) {
	if ( event.buttons == 1 ) {
		if ( ! node_is_folder(node) ) {
			if ( (event.movementX > 1) || (event.movementY > 1) ) {
				node.mark = event.ctrlKey ? false : true;
				tv.redraw();
			}
		}
	}
}


function mouseclick(tv, node, event) {
	if ( node_is_folder(node) ) {
		if ( node_is_parent(node) ) {
			node.fold = ! node.fold;
			tv.redraw();
		}
	} else {
		node.mark = ! node.mark;
		tv.redraw();
	}
}


function get_line_symbol(is_dir, has_children, is_folded) {
	if ( is_dir )
		if ( ! has_children )
			return SYMBOL.EMPTY;
		else
			if ( is_folded )
				return SYMBOL.EXPAND;
			else
				return SYMBOL.FOLD;
	else
		return SYMBOL.LEAF;
}


function make_div(is_dir, is_marked, has_children, text) {
	var text = document.createTextNode(text);
	var line = document.createElement("p");
	line.appendChild(text);
	line.classList.add("tv-line");
	if ( is_dir ) {
		line.classList.add("tv-folder");
		if ( ! has_children ) line.classList.add("tv-empty");
	} else {
		line.classList.add("tv-file");
		if ( is_marked ) line.classList.add("tv-marked");
	}
	return line;
}


function create_line(tv, node, prefix) {
	var has_children = node_is_parent(node);
	var is_folded = node_is_folded(node);
	var is_marked = node_is_marked(node);
	var caption = get_node_name(node);
	var is_dir = node_is_folder(node);
	var symbol = get_line_symbol(is_dir, has_children, is_folded);
	var element = make_div(is_dir, is_marked, has_children, prefix+symbol+caption);
	element.onclick = function(event) { mouseclick(tv, node, event); };
	element.onmousemove = function(event) { mousemove(tv, node, event); };
	return element;
}


function append_children(tv, div, node, prefix) {
	var child_count = node.list.length;
	var child_index = 0;
	for ( child_index = 0; child_index < child_count; child_index++ ) {
		var child = node.list[child_index];
		var is_last = child_index == child_count-1;
		var is_dir = node_is_folder(child);
		var has_children = node_is_parent(child);
		var folded = node_is_folded(child);
		var new_prefix = prefix + (is_last ? SYMBOL.ELBOW : SYMBOL.TEE);
		div.appendChild(create_line(tv, child, new_prefix));
		if ( is_dir && has_children && !folded ) {
			new_prefix = prefix + (is_last ? SYMBOL.SPACE : SYMBOL.BAR);
			append_children(tv, div, child, new_prefix);
		}
	}
}


function rebuild_tree(tv, div, node, filter) {
	/* Keep the root node name for later */
	var root_node_name = get_node_name(node);

	/* Remove all elements */
	while ( div.lastChild ) div.removeChild(div.lastChild);

	/* If filter, make a filtered copy of the data */
	if ( filter ) node = filter_tree(node, filter);

	if ( node ) {
		/* Add the root node */
		div.appendChild(create_line(tv, node, ""));
		if ( ! node_is_folded(node) ) {
			/* Add child nodes */
			append_children(tv, div, node, "");
		}
	} else {
		/* Add fake root node */
		var fake_node = {
			name: root_node_name,
			fold: false,
			list: [],
		}
		div.appendChild(create_line(tv, fake_node, ""));
	}
}


function filter_tree(node, filter) {
	if ( node && node.list ) {
		if ( node.list.length > 0 ) {
			/* We want brand new folder nodes */
			var result = {
				name: node.name,
				fold: false,
				list: [],
			}
			for ( var i=0; i<node.list.length; i++ ) {
				var child = node.list[i];
				/* Filter may return old leaf or new folder */
				var old_or_new = filter_tree(child, filter);
				if ( old_or_new ) {
					result.list.push(old_or_new);
				}
			}
			if ( result.list.length > 0 ) {
				return result;
			}
		}
	} else if ( node && node.name ) {
		if ( node.name.search(filter) != -1 ) {
			/* We want original leaf nodes */
			return node
		}
	}
	return null;
}

