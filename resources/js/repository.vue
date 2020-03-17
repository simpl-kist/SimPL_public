<style>
	.search_wrapper{
		margin-top:25px;
	}
	.simpl-repository-tab{
		width:50%;
		height:48px;
		display:inline-block;
		float:left;
		text-align:center;
		background-color:#EFEFEF;
		position:relative;
		cursor:pointer;
	}
	.simpl-repository-tab span{
		top:0;
		bottom:0;
		margin:auto;
		position:absolute;
		height:fit-content;
	}
	.simpl-repository-tab.active{
		background-color:black;
	}
	.simpl-repository-tab.active span{
		color:white;
	}
	.simpl-repository-content{
		display:inline-block;
		width:100%;
		float:left;
		padding:1px;
		background-color:white;
		height:calc(100vh - 120px);
	}
	.simpl-repository-web{
		width:100%;
		float:left;
		background-color:#CCAAAA;
		height:100%;
	}
	.simpl-repository-server{
		display:none;
		width:100%;
		float:left;
		background-color:#AACCAA;
		height:100%;
	}
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        I'm an example component.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	data:function(){

	},
	mounted() {
	    console.log('Component mounted.')
	},
	methods:{

	}
}
</script>
