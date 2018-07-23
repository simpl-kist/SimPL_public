@extends('admin.master')
@section('title')
Repositories
@stop
@section('content')
@include('parts.repository',["from"=>"admin"])
@stop
