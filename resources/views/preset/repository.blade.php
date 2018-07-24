@extends('master')

@section('content')
<div class='container'>
@include('parts.repository',["from"=>"preset"])
</div>
@endsection
