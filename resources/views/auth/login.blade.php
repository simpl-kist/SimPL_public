@extends('layouts.app')

@section('content')
		<style>
			.modify-icon{
				color:#cecece;
				cursor:pointer;
			}
			.modify-icon:hover{
				color:black;
			}
		</style>
		<form method="POST" action="{{ route('login') }}">
			@csrf
			<div class="form-group row">
				<label for="email" class="col-3 col-form-label text-right">{{ __('E-Mail Address') }}</label>

				<div class="col-6">
					<input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

					@error('email')
						<span class="invalid-feedback" role="alert">
							<strong>{{ $message }}</strong>
						</span>
					@enderror
				</div>
			</div>

			<div class="form-group row">
				<label for="password" class="col-3 col-form-label text-right">{{ __('Password') }}</label>

				<div class="col-6">
					<input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

					@error('password')
						<span class="invalid-feedback" role="alert">
							<strong>{{ $message }}</strong>
						</span>
					@enderror
				</div>
			</div>

			<div class="form-group row">
				<div class="col-3">
				</div>
				<div class="col-6" style="text-align:left;">
					@if (Route::has('password.request'))
						<a class="btn-link" href="{{ route('password.request') }}" style="padding-left:0">
							{{ __('Forgot Your Password?') }}
						</a>
					@endif
					<div class="form-check" style="float:right;">
						<input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
						<label class="form-check-label" for="remember">
							{{ __('Remember Me') }}
						</label>
					</div>

				</div>
			</div>

			<div class="form-group row mb-0">
				<div class="col-3 offset-3" style="text-align:left;">
					<button type="button" class="btn btn-simpl" onclick="javascript:location.href='/register';">
						{{ __('Register') }}
					</button>
				</div>
				<div class="col-3" style="text-align:right;">
					<i class="fas fa-cog modify-icon" onclick="alert('You can modify your account information after you log in.');location.href='/preset/account'"></i>
					<button type="submit" class="btn btn-simpl">
						{{ __('Login') }}
					</button>


				</div>
			</div>
		</form>
@endsection
