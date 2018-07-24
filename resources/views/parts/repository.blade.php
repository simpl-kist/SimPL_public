<style>
	.repos_button{
		width:65%;
		height:25%;
		font-size:26px;
	}


</style>
<div class=row style="text-align:center;">
	<div class=col-xs-6 style="position:relative;padding-bottom:50%">
		<div style="position:absolute;top:15%;left:30%;right:0;bottom:0">
	@if($from==="admin")
			<button class="btn btn-primary repos_button" onclick="location.href='/admin/repository/web'">
	@elseif($from==="preset")
			<button class="btn btn-primary repos_button" onclick="location.href='/preset/repository/web'">
	@endif
				For Web
			</button>
		</div>
	</div>
	<div class=col-xs-6 style="position:relative;padding-bottom:50%">
		<div style="position:absolute;top:15%;left:0;right:30%;bottom:0">
	@if($from==="admin")
			<button class="btn btn-info repos_button" onclick="location.href='/admin/repository/server'">
	@elseif($from==="preset")
			<button class="btn btn-info repos_button" onclick="location.href='/preset/repository/server'">
	@endif
				For Server
			</button>
		</div>
	</div>
</div>

