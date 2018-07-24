@extends('master')

@section('content')
<div class='container'>
@include('parts.repository_web',['repos'=>$repos,"from"=>"preset"])
</div>
@endsection
