@extends('master')

@section('content')
<div class='container'>
@include('parts.repository_server',['repos'=>$repos,"from"=>"preset"])
</div>
@endsection
