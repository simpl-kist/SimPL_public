@extends('admin.master')
@section('title')
Repositories
@stop
@section('content')
@include('parts.repository_server',['repos'=>$repos,"from"=>"admin"])
@stop
