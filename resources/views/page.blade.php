@extends('master')

@section('title')
{!! $title !!}
@stop

@section('content')
{!! $env['header'] !!}
<div class=container>
{!! $contents !!}
</div>
{{$env['footer']}}
@stop
