
function Treeview(body_element) {

	this.data = [];
	this.body_element = body_element;


	this.onchange = function(new_data) {
		console.log(new_data);
	}


	this.setData = function(data) {
		this.data = data;
		this.redraw();
	}


	this.redraw = function() {
		rebuild_tree(this.body_element, this.data);
		this.onchange(this.data);
	}


	const SYMB = {
		EXP: "&#8862;" /* ⊞ */,
		FLD: "&#8863;" /* ⊟ */,
		EMP: "&#8865;" /* ⊡ */,
		END: "&#9588;" /* ╴ */,
		BAR: "&#9474;" /* │ */,
		WHI:  "&#160;" /*   */,
		ELB: "&#9584;" /* ╰ */,
		TEE: "&#9500;" /* ├ */,
		NWL: '\n'
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


	function mousemove(node, event) {
		if ( event.buttons == 1 ) {
			var x = event.movementX;
			var y = event.movementY;
			/* Was it a swipe move? i.e. movement more than 1 pixels.. */
			if ( Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) ) > 1 ) {
				if ( ! is_node_a_dir(node) ) {
					node.mark = event.ctrlKey ? false : true;
					redraw();
				}
			}
		}
	}


	function mouseclick(node) {
		if ( is_node_a_dir(node) ) {
			if ( ! is_node_empty(node) ) {
				node.fold = ! node.fold;
				redraw();
			}
		} else {		
			node.mark = ! node.mark;
			redraw();
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


	function make_div(is_marked, text) {
		var line = document.createElement("div");
		var text = document.createTextNode(text);
		if ( is_marked ) {
			mark = document.createElement("mark");
			mark.appendChild(text);
			text = mark;
		}
		line.appendChild(text);
		return line;
	}


	function create_line(node_ref, is_dir, is_empty, is_folded, is_marked, prefix, caption) {
		var symbol = get_line_symbol(is_dir, is_empty, is_folded);
		var element = make_div(is_marked, prefix+symbol+caption);
		element.onclick = function(event) { mouseclick(node_ref); };
		element.onmousemove = function(event) { mousemove(node_ref, event); };
		return element;
	}


	function append_children(doc, node, prefix) {
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
			doc.appendChild(create_line(child, is_dir, is_empty, is_folded, is_marked, new_prefix, caption));
			if ( is_dir && !is_empty && !is_folded ) {
				new_prefix = prefix + (is_last ? SYMB.WHI : SYMB.BAR);
				append_children(doc, child, new_prefix);
			}
		}
	}


	function rebuild_tree(doc, nodes) {
		while ( doc.lastChild ) doc.removeChild(doc.lastChild); /* Clearing doc */
		var prefix = "";
		for ( var i=0; i<nodes.length; i++ ) {
			var node = nodes[i];
			var caption = node.name;
			var is_dir = is_node_a_dir(node);
			var is_empty = is_node_empty(node);
			var is_folded = is_node_folded(node);
			var is_marked = is_node_marked(node);
			doc.appendChild(create_line(node, is_dir, is_empty, is_folded, is_marked, prefix, caption));
			if ( is_dir && !is_empty && !is_folded ) {
				append_children(doc, node, prefix);
			}
		}
		// return "<span style='font-family: monospace; white-space: pre-line; user-select: none;'>" + result + "</span>";
	}
}
