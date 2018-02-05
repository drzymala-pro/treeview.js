
const SYMB = {
	/* Not using HTML entities because of createTextNode() */
	EXP: "⊞",
	FLD: "⊟",
	EMP: "⊡",
	END: "╴",
	BAR: "│",
	WHI: " ",
	ELB: "╰",
	TEE: "├"
}


function Treeview(body_element) {

	var objPtr = this;
	this.filter = "";
	this.data = [];
	this.body_element = body_element;
	this.filter_box = document.createElement("input");
	this.filter_box.classList.add("tv-filter");
	this.filter_box.placeholder = "Add filter...";
	this.filter_box.oninput = function(e){ objPtr.onfilter(this.value); };
	this.body_element.appendChild(this.filter_box);


	this.onchange = function(new_data) {
		/* This function will be provided by user */
	}


	this.setData = function(data) {
		this.data = data;
		this.redraw();
	}


	this.redraw = function() {
		rebuild_tree(this, this.body_element, this.data);
		this.onchange(this.data);
	}


	this.onfilter = function(value) {
		this.filter = value;
		this.redraw();
	}


	function is_node_a_dir(node) {
		return node.file === false;
	}


	function is_node_empty(node) {
		return node.list ? node.list.length == 0 : true;
	}


	function is_node_folded(node) {
		return node.fold;
	}


	function is_node_marked(node) {
		return node.mark;
	}


	function mousemove(objPtr, node, event) {
		if ( event.buttons == 1 ) {
			var x = event.movementX;
			var y = event.movementY;
			/* Was it a swipe move? i.e. movement more than 1 pixels.. */
			if ( Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) ) > 1 ) {
				if ( ! is_node_a_dir(node) ) {
					node.mark = event.ctrlKey ? false : true;
					objPtr.redraw();
				}
			}
		}
	}


	function mouseclick(objPtr, node, event) {
		if ( is_node_a_dir(node) ) {
			if ( ! is_node_empty(node) ) {
				node.fold = ! node.fold;
				objPtr.redraw();
			}
		} else {
			node.mark = ! node.mark;
			objPtr.redraw();
		}
	}


	function get_line_symbol(is_dir, is_empty, is_folded) {
		if ( is_dir )
			if ( is_empty )
				return SYMB.EMP;
			else
				if ( is_folded )
					return SYMB.EXP;
				else
					return SYMB.FLD;
		else
			return SYMB.END;
	}


	function make_div(is_dir, is_marked, is_empty, text) {
		var text = document.createTextNode(text);
		var line = document.createElement("p");
		line.appendChild(text);
		line.classList.add("tv-line");
		if ( is_dir ) {
			line.classList.add("tv-folder");
			if ( is_empty ) {
				line.classList.add("tv-empty");
			}
		} else {
			line.classList.add("tv-file");
			if ( is_marked ) {
				line.classList.add("tv-marked");
			}
		}
		return line;
	}


	function create_line(objPtr, node_ref, is_dir, is_empty, is_folded, is_marked, prefix, caption) {
		var symbol = get_line_symbol(is_dir, is_empty, is_folded);
		var element = make_div(is_dir, is_marked, is_empty, prefix+symbol+caption);
		element.onclick = function(event) { mouseclick(objPtr, node_ref, event); };
		element.onmousemove = function(event) { mousemove(objPtr, node_ref, event); };
		return element;
	}


	function passes_filter(objPtr, is_dir, caption) {
		if ( is_dir ) return true;
		if ( ! objPtr.filter ) return true;
		if ( caption.search(objPtr.filter) != -1 ) return true;
		return false;
	}


	function append_children(objPtr, doc, node, prefix) {
		doc.classList.add("tv-container");
		var child_count = node.list.length;
		var child_index = 0;
		for ( child_index = 0; child_index < child_count; child_index++ ) {
			var child = node.list[child_index];
			var is_last = child_index == child_count-1;
			var caption = child.name;
			var is_dir = is_node_a_dir(child);
			var is_empty = is_node_empty(child);
			var is_folded = is_node_folded(child);
			var is_marked = is_node_marked(child);
			var new_prefix = prefix + (is_last ? SYMB.ELB : SYMB.TEE);
			if ( passes_filter(objPtr, is_dir, caption) ) {
				doc.appendChild(create_line(objPtr, child, is_dir, is_empty, is_folded, is_marked, new_prefix, caption));
			}
			if ( is_dir && !is_empty && !is_folded ) {
				new_prefix = prefix + (is_last ? SYMB.WHI : SYMB.BAR);
				append_children(objPtr, doc, child, new_prefix);
			}
		}
	}


	function rebuild_tree(objPtr, doc, nodes) {
		/* Remove all elements but first - the filter box */
		while ( doc.lastChild && ( doc.lastChild !== objPtr.filter_box ) ) doc.removeChild(doc.lastChild);
		var prefix = "";
		for ( var i=0; i<nodes.length; i++ ) {
			var node = nodes[i];
			var caption = node.name;
			var is_dir = is_node_a_dir(node);
			var is_empty = is_node_empty(node);
			var is_folded = is_node_folded(node);
			var is_marked = is_node_marked(node);
			if ( passes_filter(objPtr, is_dir, caption) ) {
				doc.appendChild(create_line(objPtr, node, is_dir, is_empty, is_folded, is_marked, prefix, caption));
			}
			if ( is_dir && !is_empty && !is_folded ) {
				append_children(objPtr, doc, node, prefix);
			}
		}
	}
}
