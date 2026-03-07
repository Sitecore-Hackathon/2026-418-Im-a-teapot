# shell.nix
with import <nixpkgs> { };

mkShell {
  name = "dotnet-env";
  packages = [
    dotnet-sdk_10
    nodejs_24
  ];

  DOTNET_ENVIRONMENT = "development";
  DOTNET_ROOT = "${pkgs.dotnet-sdk_10}/share/dotnet";

  shellHook = ''
    printf "\033]0;%s\007" "$(basename "$(pwd)")"
    echo -e "\nWelcome!\n"
    echo "dotnet: $(dotnet --version)"
    echo "node  : $(node --version)"
    echo "npm   : $(npm --version)"

    echo -e "\nUpdating compose stack...\n"
    docker compose pull

    echo -e "\nStarting compose stack...\n"
    docker compose up -d
  '';
}
