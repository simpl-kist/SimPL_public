
<nav class="navbar navbar-expand-lg navbar-light bg-light" style='border-radius:0;height:62px'>
<div class=container>
  <!--<a class="navbar-brand" href="#" style='float:left;color:white;font-weight:bold;'>kCMS <i style='font-size:13px;color:#eee;'>Alpha (2nd. #1)</i></a>-->
	<a class="navbar-brand" href="#" style='float:left;color:white;font-weight:bold;'>
		<img src={{asset('assets/kcms/img/simpl_logo_w.png')}} style='height:25px;display:inline-block'>
	</a>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup" style='padding-top:15px;float:right;'>
    <div class="navbar-nav">
      <a class="nav-item nav-link active" href="{{ route('admin.dashboard') }}">Dashboard</a>
      <a class="nav-item nav-link" href="{{ route('admin.general') }}">General</a>
      <a class="nav-item nav-link" href="{{ route('admin.solvers') }}">Solvers</a>
      <a class="nav-item nav-link" href="{{ route('admin.plugins') }}">Plugins</a>
      <a class="nav-item nav-link" href="{{ route('admin.pages') }}">Pages</a>
@if(Auth::user()->policy==="admin")
      <a class="nav-item nav-link" href="{{ route('admin.users.page') }}">Users</a>
@endif
      <a class="nav-item nav-link" href="{{ route('admin.myInfo') }}">MyInfo</a>
      <a class="nav-item nav-link" href="{{ route('admin.jobs') }}">Jobs</a>
      <a class="nav-item nav-link" href="{{ route('admin.repository') }}">Repository</a>
	</div>
    </div>
  </div>
</nav>
