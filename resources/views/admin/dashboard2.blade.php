@extends('admin.master')
@section('title')
Dashboard
@endsection
@section('scripts')
<link rel=stylesheet href={{URL::asset('/assets/vendor/admin-lte/dist/css/AdminLTE.min.css')}}>
<script src={{URL::asset('/assets/vendor/admin-lte/dist/js/adminlte.min.js')}}></script>
@endsection
@section('content')
<h2>Dashboard</h2>
<div class=row>
	<div id="user">user</div>
	<div id="jobs">jobs</div>
	<div id="nodes">nodes</div>
	<div id="master">master</div>
</div>
@endsection
