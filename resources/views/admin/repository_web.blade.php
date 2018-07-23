@extends('admin.master')
@section('title')
Repositories
@stop
@section('content')
@include('parts.repository_web',['repos'=>$repos,"from"=>"admin"])
@stop
