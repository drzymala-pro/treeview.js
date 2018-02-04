

var nodelist = [
	{
		"name": "DirectoryOne",
		"file": false,
		"fold": true,
		"list": [
			{"name": "SYSLOG_001.LOG", "file": true, "mark": false},
			{"name": "SYSLOG_002.LOG", "file": true, "mark": false},
			{"name": "SYSLOG_003.LOG", "file": true, "mark": false},
			{"name": "SYSLOG_004.LOG", "file": true, "mark": false},
			{"name": "SYSLOG_005.LOG", "file": true, "mark": false},
		]
	},
	{
		"name": "DirectoryTwo",
		"file": false,
		"fold": false,
		"list": [
			{
				"name": "Subdirectory",
				"file": false,
				"fold": false,
				"list": [
					{
						"name": "More Deep",
						"file": false,
						"fold": false,
						"list": [
							{
								"name": "Even Deeper",
								"file": false,
								"fold": false,
								"list": [
									{
										"name": "The Deepest",
										"file": false,
										"fold": false,
										"list": [
											{"name": "very_deep_file_1.LOG", "file": true, "mark": true},
											{"name": "very_deep_file_2.LOG", "file": true, "mark": false},
											{"name": "very_deep_file_3.LOG", "file": true, "mark": true}
										]
									},
								]
							},
						]
					},
					{"name": "SYSLOG_201.LOG", "file": true, "mark": true},
					{"name": "SYSLOG_202.LOG", "file": true, "mark": false},
					{"name": "SYSLOG_203.LOG", "file": true, "mark": true}
				]
			},
			{
				"name": "EmptySubdirectory",
				"file": false,
				"fold": false,
				"list": []
			},
			{"name": "SYSLOG_501.LOG", "file": true, "mark": false,},
			{"name": "SYSLOG_502.LOG", "file": true, "mark": false,},
			{"name": "SYSLOG_503.LOG", "file": true, "mark": false,},
			{"name": "SYSLOG_504.LOG", "file": true, "mark": false,},
			{"name": "SYSLOG_505.LOG", "file": true, "mark": false,},
		]
	}
]

function debug(text) {
	// console.log(text);
}

function debug_node(caption, is_dir, is_empty, is_folded) {
	debug("Printing node: " + caption + "[" + (is_dir ? "Directory" : "File") + "," + (is_empty ? "Empty" : "Occupied") + "," + (is_folded ? "Folded" : "Unfolded") + "]");
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


var SYMB = {
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


function get_line_symbol(is_dir, is_empty, is_folded, node_ref) {
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


function print_line(node_ref, is_dir, is_empty, is_folded, caption) {
	var symbol = get_line_symbol(is_dir, is_empty, is_folded, node_ref);
	var line = "<span onclick='mouseclick("+node_ref+")' onmousemove='mousemove("+node_ref+", event)'>" + symbol + caption + "</span>"
	return line + SYMB.NWL;
}


function print_node_children(node_ref, prefix, node) {
	var result = "";
	var child_count = node.list.length;
	var child_index = 0;
	for ( child_index = 0; child_index < child_count; child_index++ ) {
		var child = node.list[child_index];
		var is_last = child_index == child_count-1;
		var caption = child.name;
		var is_dir = is_node_a_dir(child);
		var is_empty = is_node_empty(child);
		var is_folded = is_node_folded(child);
		debug_node(caption, is_dir, is_empty, is_folded);
		var new_prefix = prefix + (is_last ? SYMB.ELB : SYMB.TEE);
		var new_node_ref = node_ref + ".list[" + child_index + "]";
		if ( child.mark ) caption = "<mark>" + caption + "</mark>";
		result += new_prefix + print_line(new_node_ref, is_dir, is_empty, is_folded, caption);
		if ( is_dir && !is_empty && !is_folded ) {
			new_prefix = prefix + (is_last ? SYMB.WHI : SYMB.BAR);
			result += print_node_children(new_node_ref, new_prefix, child);
		}
	}
	return result;
}


function print_tree(nodelist) {
	var node_ref = "nodelist";
	var result = "";
	for ( var i=0; i<nodelist.length; i++ ) {
		var node = nodelist[i];
		var caption = node.name;
		var is_dir = is_node_a_dir(node);
		var is_empty = is_node_empty(node);
		var is_folded = is_node_folded(node);
		debug_node(caption, is_dir, is_empty, is_folded);
		var new_node_ref = node_ref + "[" + i + "]";
		if ( node.mark ) caption = "<mark>" + caption + "</mark>";
		result += print_line(new_node_ref, is_dir, is_empty, is_folded, caption);
		if ( is_dir && !is_empty && !is_folded ) {
			debug("Printing node: " + caption + " children.");
			var prefix = "";
			result += print_node_children(new_node_ref, prefix, node);
		}
	}
	return "<span style='font-family: monospace; white-space: pre-line; user-select: none;'>" + result + "</span>";
}


function redraw() {
	console.log(print_tree(nodelist));
}

