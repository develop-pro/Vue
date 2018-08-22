<template>
    <main class="main-content">

        <unit-header :unitid="3"/>
        
        <md-card v-show="showTransForm">
            
            <md-card-content>
        
                    <md-button  v-on:click="isCash = !isCash">
                        <md-icon style="color:green;" v-bind:class="{ 'md-size-3x': isCash}">attach_money</md-icon>
                    </md-button>
                
                    <md-button v-on:click="upload()"><md-icon v-bind:class="{ 'md-size-3x': !isCash}">photo_camera</md-icon>
                        <input id="file_upload" type="file" accept="image/*;capture=camera" hidden>
                    </md-button>

                    <md-field class="input-md-width">
                        <label for="vAmt">Amount</label>
                        <md-input v-model="vAmount" name="vAmt" id="vAmt"></md-input>
                    </md-field>
                
                    <md-field class="input-md-width">
                        <label for="vDt">Date</label>
                        <md-input v-model="vDate" name="vDt" id="vDt"></md-input>
                    </md-field>
                
            </md-card-content>

            <md-card-actions>
                <md-button v-on:click="showTransForm = !showTransForm" class="md-icon-button">
                    <md-icon class="md-primary">close</md-icon>
                </md-button>    
                
                <md-button class="md-raised md-primary">save</md-button>
            </md-card-actions>
    </md-card>
        
        <md-card v-show="showNoteForm">
            
            <md-card-content>
                <md-field>
                    <label for="">rent note</label>
                    <md-input v-model="vNote">
                         
                    </md-input>
                </md-field>
            </md-card-content>
            <md-card-actions>
                    <md-button v-on:click="showNoteForm = !showNoteForm" class="md-icon-button">
                        <md-icon class="md-primary">close</md-icon>
                    </md-button>    
                    
                    <md-button class="md-raised md-primary">save</md-button>
            </md-card-actions>    
            
        </md-card>
        
        <md-card>
            <md-card-header class="orange">
                <div class="md-title">
                    <md-button v-on:click="showTransForm = !showTransForm" ><span class="md-display-1">$695 Due</span></md-button>
                <!--    <md-button style="float:right" v-on:click="showTransForm = !showTransForm" class="md-display-1">add</md-button>-->
                <md-button v-on:click="showNoteForm = !showNoteForm" class="md-icon-button" style="float:right;">
                    <md-icon class="md-primary">chat_bubble</md-icon>
                </md-button>
                </div> 
            </md-card-header>
            <md-list class="md-double-line">
                <md-list-item>
                  <md-icon style="color:green;">attach_money</md-icon> 
                      <div>
                          9/1/2017
                      </div>
                      <div class="md-headline">
                          $695
                      </div>
                      
                </md-list-item>
                <md-list-item>
                  <md-icon style="color:green;">attach_money</md-icon> 
                      <div>
                          8/4/2017
                      </div>
                      <div class="md-headline">
                          $695
                      </div>
            
                </md-list-item>
            
                <md-list-item>
                    
                      <div>8/1/2017</div>
                      <div>
                          <md-chip>Static</md-chip>
                      </div>
                    
                </md-list-item>
                
                <md-list-item>
                  <md-icon style="color:green;">attach_money</md-icon> 
                      <div>
                          7/4/2017
                      </div>
                      <div class="md-headline">
                          $695
                      </div>
                </md-list-item>
                
                <md-list-item>
                    
                      <span>7/1/2017</span>
                        
                      <md-chip>
                          Will pay pay on 7/6/2017
                      </md-chip>
                    
                  <md-divider class="md-inset"></md-divider>
                  
                </md-list-item>
            
                <md-list-item>
                  <md-icon style="color:green;">attach_money</md-icon> 
                      <div>
                          6/4/2017
                      </div>
                      <div class="md-headline">
                          $695
                      </div>
                </md-list-item>
            
            </md-list>
    </md-card>

    </main>
</template>

<script>
    export default{
      props: {
        // isCash: false,
      },
      data() {
        return {
          vAmount: '695',
          vDate: '10/20/2017',
          vNote: '',
          showTransForm: false,
          showNoteForm: false,
        };
      },
      methods: {
        home() {
          this.$router.push('/');
        },
        upload() {
          // file_upload.click();
          // this.isCash = false;
        },
      },
    };
</script>
<style type="text/css">
    
</style>