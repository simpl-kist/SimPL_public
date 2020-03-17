<style>
	.repos_button{
		width:65%;
		height:25%;
		font-size:26px;
	}


</style>
<div class="container">
	<div class=row style="text-align:center;">
		<div class=col-6 style="position:relative;padding-bottom:50%">
			<div style="position:absolute;top:15%;left:30%;right:0;bottom:0">
	@if($from==="admin")
				<button class="btn btn-outline-secondary repos_button" onclick="location.href='/admin/repositories/web'">
	@elseif($from==="preset")
				<button class="btn btn-outline-secondary repos_button" onclick="location.href='/preset/repositories/web'">
	@endif
					For Web
				</button>
			</div>
		</div>
		<div class=col-6 style="position:relative;padding-bottom:50%">
			<div style="position:absolute;top:15%;left:0;right:30%;bottom:0">
	@if($from==="admin")
				<button class="btn btn-outline-secondary repos_button" onclick="location.href='/admin/repositories/server'">
	@elseif($from==="preset")
				<button class="btn btn-outline-secondary repos_button" onclick="location.href='/preset/repositories/server'">
	@endif
					For Server
				</button>
			</div>
		</div>
	</div>
</div>

