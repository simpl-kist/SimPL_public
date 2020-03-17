@extends('admin.layout')
@section('title')
Repositories
@stop
@section('content')
<div class="container">
@include('parts.repositories_server',['repos'=>$repos,"from"=>"admin"])
</div>
@stop
