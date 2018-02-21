@extends('master')

@section('content')
<div class='container'>
@include('parts.userInfo',['user'=>$user])
</div>
@endsection
