@extends('layouts.app')

@section('content')
	<form method="POST" action="{{ route('register') }}">
		@csrf
		<div class="form-group row">
			<label for="name" class="col-3 col-form-label text-right">{{ __('Name') }}</label>

			<div class="col-6">
				<input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

				@error('name')
					<span class="invalid-feedback" role="alert">
						<strong>{{ $message }}</strong>
					</span>
				@enderror
			</div>
		</div>

		<div class="form-group row">
			<label for="email" class="col-3 col-form-label text-right">{{ __('E-Mail Address') }}</label>

			<div class="col-6">
				<input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

				@error('email')
					<span class="invalid-feedback" role="alert">
						<strong>{{ $message }}</strong>
					</span>
				@enderror
			</div>
		</div>
<?php
use App\CmsEnv;

$req_affil = CmsEnv::where("var_key", "req_affil")->first();
if(isset($req_affil)){
	$req_affil = $req_affil->var_value;
}else{
	$req_affil = false;
}

$req_phone = CmsEnv::where("var_key", "req_phone")->first();
if(isset($req_phone)){
	$req_phone = $req_phone->var_value;
}else{
	$req_phone = false;
}
?>
@if(isset($req_affil) && $req_affil)
		<div class="form-group row">
			<label for="affiliation" class="col-3 col-form-label text-right">Affiliation</label>

			<div class="col-6">
				<input id="affiliation" class="form-control @error('affiliation') is-invalid @enderror" name="affiliation" value="{{ old('affiliation') }}" required autocomplete="affiliation" autofocus>

				@error('affiliation')
					<span class="invalid-feedback" role="alert">
						<strong>{{ $message }}</strong>
					</span>
				@enderror
			</div>
		</div>
@endif
@if(isset($req_phone) && $req_phone)
		<div class="form-group row">
			<label for="phoneiation" class="col-3 col-form-label text-right">Phone</label>

			<div class="col-6">
				<input id="phone" class="form-control @error('phone') is-invalid @enderror" name="phone" value="{{ old('phone') }}" required autocomplete="phone" autofocus>

				@error('phone')
					<span class="invalid-feedback" role="alert">
						<strong>{{ $message }}</strong>
					</span>
				@enderror
			</div>
		</div>
@endif

		<div class="form-group row">
			<label for="password" class="col-3 col-form-label text-right">{{ __('Password') }}</label>

			<div class="col-6">
				<input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

				@error('password')
					<span class="invalid-feedback" role="alert">
						<strong>{{ $message }}</strong>
					</span>
				@enderror
			</div>
		</div>

		<div class="form-group row">
			<label for="password-confirm" class="col-3 col-form-label text-right">{{ __('Confirm Password') }}</label>

			<div class="col-6">
				<input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
			</div>
		</div>

		<div class="form-group row mb-0">
			<div class="col-6 offset-3" style="text-align:right;">
				<button type="submit" class="btn btn-simpl">
					{{ __('Register') }}
				</button>
			</div>
		</div>
	</form>
@endsection
