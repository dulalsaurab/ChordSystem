// this is to create a circular nodes for chord 

id = 0;
class Node {

    constructor(successor, predecessor, exist, name, index=null){
        this.data = {};
        this.successor = successor;
        this.predecessor = predecessor;
        this.exist = exist;
        if (index == null) this.id = id++;
        else this.id = index;
        this.name = name; 
        this.random = Math.floor(Math.random() * 650000) + 1;
    }
}

class Chord {

    constructor (no_of_nodes, names){

        this.no_of_nodes = no_of_nodes
        // for(var i = 0; i < no_of_nodes; i++ ){
        //     var node_name = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0);
        //     this.chord_nodes.push(new Node(null, null, 0, node_name, i));
        // }
        this.chord_nodes = Array.from({ length: no_of_nodes }, () => new Node(null, null, 0, (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0))); //this will store the list of nodes that have a chord 
    } 
    
    generateNode(){
        return (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0);
    }

    data_migration(pred, current, succes){

        var responsible_for = this.node_pre_nodes_index(pred, current);
        if(succes.data != null){
            for (var index in succes.data){
                var temp_dict = {}
                if (responsible_for.includes(parseInt(index))) // <= current.id) 
                    {   
                        temp_dict[index] = succes.data[index];
                        this.add_data(current.id, temp_dict);
                        delete succes.data[index];
                    }
            }
        }
    }

    add_node (k){ //k is this index
    
        // we have to add a node in the k'th position of chord, note k should be with the range of chord system 
        // check if a node already exist in this position

        if (this.chord_nodes[k].exist == 0){
            
            var new_node = this.chord_nodes[k];
            
            //check if chord system is empty or not
            // these function should return nodes, not just the index 
            var successor = this.find_successor(k); 
            var predecessor = this.find_predecessor(k); 
            
            new_node.exist = 1;
            if (successor == null && predecessor == null) {

                // this is the first node in the chord system
                new_node.predecessor = new_node;
                new_node.successor = new_node;
            }
            else {
                
                // data movement
                // call data migration
                
                this.data_migration(predecessor, new_node, successor);

                new_node.successor = successor;
                new_node.predecessor = predecessor;
                predecessor.successor = new_node; 
                successor.predecessor = new_node; 

                // where should the prede prede point and succ succ point  
                // if we have only two nodes by now, following simple modification needs to be done
                if (this.chord_nodes_count() < 3 ) {
                    predecessor.predecessor = new_node
                    successor.successor = new_node
                }
            }
        console.log("Node added successfully");     
        return [1, "Node added successfully" ];
        }
        else {
            console.log("Node already exists"); 
            return [2, " already exists"];
        }
    }


    delete_node (k){
        
        //first check whether node k exists or not
        if (this.chord_nodes[k].exist == 1) {
            
            var successor = this.find_successor(k);
            this.add_data(successor.id, this.chord_nodes[k].data);
            this.chord_nodes[k].predecessor.successor = this.chord_nodes[k].successor
            this.chord_nodes[k].successor.predecessor = this.chord_nodes[k].predecessor
            this.chord_nodes[k] = new Node(null, null, 0, this.chord_nodes[k].name, this.chord_nodes[k].id)
            
            console.log("Node doesn't exist");
            return [1, "Node deleted sucessfully"];
        }
        else {
            console.log("Node doesn't exist");
            return [2, "doesn't exist"];
        }
        
    }

    add_data(k, data){

        // check if node exists in k, if not find successor of k and add data to it
        var node; 
        if (this.chord_nodes[k].exist == 1) node = this.chord_nodes[k];
        else node = this.find_successor(k);

        if (node==null) return [false];

        if (node.data[k]) node.data[k].push(data); 
        else if (typeof(data) == 'object') {//node.data.push(data);
            node.data = {...data, ...node.data};
        }
        else node.data[k] = [data];

        return [true, node.id]

    }

    delete_data(k, data){

        if(this.chord_nodes[k].exist == 1) {
            console.log(this.chord_nodes[k].data[k]);
            if (this.chord_nodes[k].data[k] !=null) {delete this.chord_nodes[k].data[k]; return [true, k]}
            else return [false, "No data available"];
        }
        else {
            var node = this.find_successor(k);
            if (node==null) return [false, "No node available"];
            else {
                if (node.data[k] !=null) {delete node.data[k]; return [true, node.id];} 
                else return [false, "No data available"];
            }
        }
    }

    find_successor(k){
        
        var counter = k
        while (counter < this.chord_nodes.length - 1 ){
            counter = counter + 1;        
            if (this.chord_nodes[counter].exist == 1){
                return this.chord_nodes[counter];
            }
        }
        var counter = -1 
        while (counter < k){
            counter = counter + 1;
            if(this.chord_nodes[counter].exist == 1)
                return this.chord_nodes[counter];
        }
        return null
    }

    find_predecessor(k){
        
        var counter = k
        while (counter > 0){
            counter = counter - 1;
            if(this.chord_nodes[counter].exist == 1)
                return this.chord_nodes[counter]
        }
        var counter = this.chord_nodes.length;
        while (counter > k ){
            counter = counter - 1; 
            if (this.chord_nodes[counter].exist == 1){
                return this.chord_nodes[counter];
            }
        }
        return null

    }
    chord_nodes_count(){

        var counter = 0; 
        var node_count = 0; 
        while (counter < this.chord_nodes.length) {
            if (this.chord_nodes[counter].exist == 1){ 
                node_count+=1;}
            counter++;
        }
        return node_count;
    }
    node_pre_nodes_index (predecessor, current_node){
        
        var count = predecessor.id+1;
        var list = [];
        if (predecessor.id != current_node.id){
            while(count%16 != current_node.id){
                list.push(count%16);
                count++;
            }
            list.push(current_node.id); // (prenode, current_node] 
                                        //(2,7] - open interval at prenode and close interval at current node 
        }
        else {
            list = [...Array(16)].map((_,i) => i)
        } 
        return list
    }
} 

function isPowerOf_2(number){

    return (number & (number - 1)) == 0;
}


function sha1(){

    // given any value this function will compute sha1 
}

var chord_length = 16; 

if (!isPowerOf_2(16)){
    console.log("Cord system must be in power of 2");
}


// **************************** This section is used for test case ********************* 
// const chord = new Chord(16);
// console.log(chord.chord_nodes);
// chord.add_node(15);
// console.log(chord.chord_nodes);
// chord.add_data(2, "me");
// chord.add_data(3, "Ram");
// chord.add_data(4, "Shyam");
// chord.add_data(7, "for seven");
// console.log(2, chord.chord_nodes[2].data)
// chord.add_node(7);
// console.log(chord.chord_nodes);
// console.log(2, chord.chord_nodes[2].data)
// console.log(7, chord.chord_nodes[7].data)
// // console.log(chord.chord_nodes)
// chord.add_node(5);
// console.log(2, chord.chord_nodes[2].data)
// console.log(7, chord.chord_nodes[7].data)
// console.log(5, chord.chord_nodes[5].data)

// **************************** This section is used for test case ********************* 







