<style>
	.simpl-navbar{
		background-color:black !important;
	}
	.simpl-navbar .nav-link{
		font-size:16px;
		padding-top:0.75rem;
	}
</style>

<nav class="navbar navbar-expand bg-dark navbar-dark simpl-navbar" style="height:70px;">
	<ul class="navbar-nav">
		<a class="navbar-brand" href="/admin/dashboard"><img src="/image/simpl_logo_w.png" style="height:40px;"></a>
		<li class="nav-item{{Request::is('admin/dashboard') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/dashboard">Dashboard</a>
		</li>
@if(Auth::user()->policy === 'admin')
		<li class="nav-item{{Request::is('admin/general') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/general">General</a>
		</li>
@endif
		<li class="nav-item{{Request::is('admin/solvers') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/solvers">Solvers</a>
		</li>
		<li class="nav-item{{Request::is('admin/plugins') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/plugins">Plugins</a>
		</li>
		<li class="nav-item{{Request::is('admin/pages') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/pages">Pages</a>
		</li>
@if(Auth::user()->policy === 'admin')
		<li class="nav-item{{Request::is('admin/users') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/users">Users</a>
		</li>
@endif
		<li class="nav-item{{Request::is('admin/jobs') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/jobs">Jobs</a>
		</li>
		<li class="nav-item{{Request::is('admin/repositories') ? ' active' : ''}}">
			<a class="nav-link" href="/admin/repositories">Repositories</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" href="/logout"><i class="fas fa-sign-out-alt"></i></a>
		</li>
	</ul>
</nav>

