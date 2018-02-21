@extends('master')

@section('title')
{!! $title or "" !!}
@stop

@section('content')
{!! $env['header'] or "" !!}
<div class=container>
{!! $contents !!}
</div>
{!! $env['footer'] or "" !!}
@stop
