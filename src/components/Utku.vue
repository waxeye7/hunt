<script setup></script><template><div class="main-grid">  <div class="select-size-map">    <label>Rows : </label>    <input type="number" v-model="row_no" :min="row_min" :max="row_max" placeholder="Enter Row Number">    <label>Columns : </label>    <input type="number" v-model="col_no" :min="col_min" :max="col_max" placeholder="Enter Column Number">    <label>Water Intensity : </label>    <input type="number" v-model="water_intensity" min=10 max=60 placeholder="Water Intensity" step=10>    <input type="submit" value="Make Map" @click="make_map_rec">  </div>  <div class="map">    <div class="rows" v-for="row in map">      <div class="cols" v-for="col in row">        <div class="tile" :class="{impassible:col<2}"></div>      </div>    </div>  </div></div></template><style scoped>.main-grid{
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
  }
  .select-size-map{padding: 10px;}
  .map{
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
  }
  .rows{
    display: flex;
    gap: 10px;
  }
  .tile{
    width:  50px;
    height: 50px;
    background-color: green;
  }
  .impassible{background-color: blue !important;}
  </style><script>export default {
    data(){
      return{
        row_no:5,
        col_no:5,
        row_max:20,
        col_max:20,
        row_min:3,
        col_min:3,
        map:[],
        current_check:2,
        keep_tiling:true,
        water_intensity:50
      }
    },
    methods:{
      // for loop method
      make_map(){
        this.map = [];
        for(let i=0; i<this.row_no; i++){
            this.map.push([]);
            for(let o=0; o<this.col_no; o++)
              this.map[i].push(0);
        }
        this.map[0][0]=2;
        let r,c;
        this.keep_tiling=true;
        this.current_check=2;
        while(this.keep_tiling){
          this.keep_tiling=false;
          for(r=0;r<this.map.length;r++)
            for(c=0;c<this.map[r].length;c++)
              if(this.map[r][c] == this.current_check)
                this.check_neigbors(r,c)
          this.current_check++;
        }
      },
      check_neigbors(r,c){
        for(let i=-1;i<2;i++)
          for(let o=-1;o<2;o++)
            if((r+i>=0)&&(c+o>=0)&&(r+i<this.row_no)&&(c+o<this.col_no))
              if(!this.map[r+i][c+o])
                this.decide_tile(r+i,c+o);
      },
      decide_tile(r,c){
        if( Math.random() < this.water_intensity/100 )
          this.map[r][c]=1;
        else{
          this.keep_tiling=true;
          this.map[r][c]=this.current_check+1;
        }  
      },
      //recursive method
      make_map_rec(){
        this.map = [];
        for(let i=0; i<this.row_no; i++){
            this.map.push([]);
            for(let o=0; o<this.col_no; o++)
              this.map[i].push(0);
        }
        this.map[Math.floor(this.row_no/2)][Math.floor(this.col_no/2)]=2;
        this.tile_push(Math.floor(this.row_no/2),Math.floor(this.col_no/2))
      },
      tile_push(r,c){
        for(let i=-1;i<2;i++)
          for(let o=-1;o<2;o++)
            if((r+i>=0)&&(c+o>=0)&&(r+i<this.row_no)&&(c+o<this.col_no))
              if(!this.map[r+i][c+o])
                this.decide_tile_rec(r+i,c+o);
      },
      decide_tile_rec(r,c){
        if( Math.random() < this.water_intensity/100 )
          this.map[r][c]=1;
        else{
          this.map[r][c]=2;
          this.tile_push(r,c);
        }  
      }
    },
    created(){
    }
  }
  </script>