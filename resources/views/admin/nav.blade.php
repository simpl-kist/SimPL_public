<style>
	.nav_active{
		text-decoration:underline;
	}
</style>
<nav class="navbar navbar-expand-lg navbar-light bg-light" style='border-radius:0;height:62px'>
	<div class=container>
  <!--<a class="navbar-brand" href="#" style='float:left;color:white;font-weight:bold;'>kCMS <i style='font-size:13px;color:#eee;'>Alpha (2nd. #1)</i></a>-->
		<a class="navbar-brand" href="{{ route('admin.dashboard') }}" style='float:left;color:white;font-weight:bold;'>
			<img src={{asset('assets/kcms/img/simpl_logo_w.png')}} style='height:25px;display:inline-block'>
		</a>
		<div class="collapse navbar-collapse" id="navbarNavAltMarkup" style='padding-top:15px;float:right;'>
			<div class="navbar-nav">
				<a class="nav-item nav-link {{Request::is('admin/dashboard') ? 'nav_active' : 'not'}}" href="{{ route('admin.dashboard') }}">Dashboard</a>
				<a class="nav-item nav-link {{Request::is('admin/general') ? 'nav_active' : 'not'}}" href="{{ route('admin.general') }}">General</a>
				<a class="nav-item nav-link {{Request::is('admin/solvers') ? 'nav_active' : 'not'}}" href="{{ route('admin.solvers') }}">Solvers</a>
				<a class="nav-item nav-link {{Request::is('admin/plugins*') ? 'nav_active' : 'not'}}" href="{{ route('admin.plugins') }}">Plugins</a>
				<a class="nav-item nav-link {{Request::is('admin/pages*') ? 'nav_active' : 'not'}}" href="{{ route('admin.pages') }}">Pages</a>
@if(Auth::user()->policy==="admin")
				<a class="nav-item nav-link {{Request::is('admin/users/page') ? 'nav_active' : 'not'}}" href="{{ route('admin.users.page') }}">Users</a>
@endif
				<a class="nav-item nav-link {{Request::is('admin/myInfo') ? 'nav_active' : 'not'}}" href="{{ route('admin.myInfo') }}">MyInfo</a>
				<a class="nav-item nav-link {{Request::is('admin/jobs') ? 'nav_active' : 'not'}}" href="{{ route('admin.jobs') }}">Jobs</a>
				<a class="nav-item nav-link {{Request::is('admin/repository*') ? 'nav_active' : 'not'}}" href="{{ route('admin.repository') }}">Repository</a>
				<a class="nav-item nav-link" href={{ route('logout')}} ><i class="glyphicon glyphicon-log-out"></i> </a>
			</div>
		</div>
	</div>
</nav>
