@extends('master')

@section('content')
<div class='container'>
@include('parts.userInfo',['user'=>$user,'from'=>"preset"])
</div>
@endsection
