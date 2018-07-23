@extends('admin.master')
@section('title')
@if($user->id === Auth::user()->id)
My Info
@else
User Info
@endif
@stop
@section('content')
@include('parts.userInfo',['user'=>$user,'from'=>"admin"])
@stop
